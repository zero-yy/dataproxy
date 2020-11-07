import { rejects } from 'assert';
import { KeyType } from 'crypto';
import * as mysql from 'mysql';
import { toNamespacedPath } from 'path';
import { markAsUntransferable } from 'worker_threads';
import log4Util from './Log4Util';
import mySqlUtil from './MySqlUtil';
import redisUtil from './RedisUtil';
import tableMetaMgr from './tableMetaMgr';
var databaseConfig = require('../config/mysql.config'); //引入数据库配置模块中的数据
var pool = mysql.createPool(databaseConfig);

// 无效id
const InvalidId: number = -1;

// 键信息
class KeyInfo {
    pid: number = InvalidId;
    aid: number = InvalidId;
}

// 数据库版本信息，，只有大版本更换的时候才需要更新
// 变相的清空了redis
const DbVersion: string = 'v1';

// 缺省join模式
const DefaultLink: string = 'AND';
const MatchAll: string[] = ['*'];
const UnknownErrStr: string = 'unknown dbProxy err';
// 7天过期
const DbExpireTtlSeconds: number = 24 * 3600 * 7;
// 空对象的过期时间，，用于防治缓存打穿
const NullExpireTtlSeconds: number = 4 * 3600;

// TODO 可以替换为其他日志
function dpErrLog(str: string) {
    // log4Util.erroLogger(str)
    console.error('[DPLOG]' + str);
}

function dpDebugLog(str: string) {
    console.debug(str);
}

// 主键pid, 聚合键aid
// where 里的参数只允许是主键或者聚合键。主键优于聚合键
export class DataProxy {
    constructor() {}

    // 判断key，至少有一个有长度或者是数字
    _isValidKey(v: number | undefined): boolean {
        let t = typeof v;
        if (t === 'number') {
            return true;
        }
        return false;
    }

    _redisKeyPid(tableName: string, pid: number): string {
        let str: string = `db${DbVersion}:${tableName}:pid:[${pid}]`;
        return str;
    }
    _redisKeyAid2Pids(tableName: string, aid: number): string {
        let str: string = `db${DbVersion}:${tableName}:aid:[${aid}]`;
        return str;
    }

    // 该函数检测数据不合法时会抛出异常，第一时间报错
    // 异常的方式不太好，调用者需要catch e，然后打断操作
    _mustGetKeyInfo(tableName: string, where: { [key: string]: number }): KeyInfo {
        if (where == null || where.length == 0) {
            throw new Error(`need where`);
        }

        if (!tableMetaMgr.hasMeta(tableName)) {
            let e = `not found tableName meta [${tableName}]`;
            throw new Error(e);
        }

        let m = tableMetaMgr.getMeta(tableName);

        // 判断key，至少有一个有长度或者是数字
        if (!this._isValidKey(where[m.primaryKey]) && !this._isValidKey(where[m.aggregateKey])) {
            let e = `need valid primaryKey or aggregateKey: [${JSON.stringify(where)}]`;
            throw new Error(e);
        }

        // 判断是否有多余key，不允许有多余key
        for (let key in where) {
            if (key != m.primaryKey && key != m.aggregateKey) {
                let e = `unknown key[${key}] for tableName [${tableName}]`;
                throw new Error(e);
            }
        }

        let ret: KeyInfo = new KeyInfo();
        if (this._isValidKey(where[m.primaryKey])) {
            ret.pid = where[m.primaryKey];
        }
        if (this._isValidKey(where[m.aggregateKey])) {
            ret.aid = where[m.aggregateKey];
        }

        return ret;
    }

    // 如果包含主键pid，则返回单项数据
    // 否则，如果是聚合键aid，则返回数组
    // 如果错误，则一般会内部打印堆栈，同时会返回出具体的错误字符串信息
    get(tableName: string, where: { [key: string]: number }): Promise<unknown> {
        let keyInfo: KeyInfo = new KeyInfo();
        try {
            keyInfo = this._mustGetKeyInfo(tableName, where);
        } catch (err) {
            dpErrLog(err.stack);
            return Promise.reject(err.message);
        }

        // promise
        if (keyInfo.pid != InvalidId) {
            return this.getOne(tableName, keyInfo.pid);
        } else if (keyInfo.aid != InvalidId) {
            return this.getMore(tableName, keyInfo.aid);
        }

        return Promise.reject(UnknownErrStr);
    }

    // result: single object, like {id:2, value:3}, if not exist, return null
    // err: string
    getOne(tableName: string, pid: number): Promise<any> {
        let pidKey: string = tableMetaMgr.getPidKey(tableName);
        if (pidKey.length == 0) {
            return Promise.reject('no pid key');
        }

        // get from redis
        let redisKey: string = this._redisKeyPid(tableName, pid);

        return redisUtil
            .getObjectWithPromise(redisKey)
            .then((result) => {
                if (result !== null) {
                    dpDebugLog(`loaded from redis: ${JSON.stringify(result)}`);
                    // 返回的有效数据里必须包含键值
                    if (result.hasOwnProperty(pidKey)) {
                        // refresh ttl
                        redisUtil.setKeyTimeout(redisKey, DbExpireTtlSeconds);
                        return result as object;
                    } else {
                        return null;
                    }
                }

                // 只有数据彻底为空，才会走数据库

                // get from db
                return mySqlUtil.select(MatchAll, tableName, { [pidKey]: pid }).then((result: object[]) => {
                    dpDebugLog(`loaded from db: ${JSON.stringify(result)}`);

                    // store into redis
                    if (result.length > 0) {
                        redisUtil.setex(redisKey, DbExpireTtlSeconds, result[0]);
                        return result[0] as object;
                    }

                    // 没有报错，而且没找到的时候，应该往redis放一个空对象，避免缓存打穿
                    redisUtil.setex(redisKey, NullExpireTtlSeconds, {});
                    return null;
                });
            })
            .catch((err) => {
                return null;
            });
    }

    getMore(tableName: string, aid: number): Promise<object> {
        return Promise.reject(UnknownErrStr);
    }
}

let dataProxy: DataProxy = new DataProxy();
export default dataProxy;
