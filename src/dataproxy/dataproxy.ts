import { table } from 'console';
import { KeyType } from 'crypto';
import * as mysql from 'mysql';
import { markAsUntransferable } from 'worker_threads';
import log4Util from './Log4Util';
import mySqlUtil from './MySqlUtil';
import TableMeta from './tableMeta';
import tableMetaMgr, { TableMetaMgr } from './tableMetaMgr';
var databaseConfig = require('../config/mysql.config');  //引入数据库配置模块中的数据
var pool = mysql.createPool(databaseConfig);

// 无效id
const InvalidId:number = -1;

// 键信息
class keyInfo {
    pid: number = InvalidId;
    aid: number = InvalidId;
}

// 缺省join模式
const DefaultLink:string = 'AND';

export class DataProxy {
    constructor() {
    }

    // 判断key，至少有一个有长度或者是数字
    _isValidKey(v: number | undefined):boolean {
        let t = typeof v
        if (t === "number") {
            return true
        }
        return false
    }

    // where 里的参数只允许是主键或者聚合键。主键优于聚合键
    // 该函数检测数据不合法时会抛出异常，第一时间报错
    _mustGetKeyInfo(tableName: string, where: { [key: string]: number }):keyInfo {
        if (where == null || where.length == 0) {
            throw new Error(`need where`)
        }

        if (!tableMetaMgr.hasMeta(tableName)) {
            let e = `not found table meta [${tableName}]`
            throw new Error(e)
        }

        let m = tableMetaMgr.getMeta(tableName)

        // 判断key，至少有一个有长度或者是数字
        if (!this._isValidKey(where[m.primaryKey]) && !this._isValidKey(where[m.aggregateKey])) {
            let e = `need valid primaryKey or aggregateKey: [${JSON.stringify(where)}]`
            throw new Error(e)
        }

        // 判断是否有多余key，不允许有多余key
        for (let key in where) {
            if (key != m.primaryKey && key != m.aggregateKey) {
                let e = `unknown key[${key}] for table [${tableName}]`
                throw new Error(e)
            }
        }

        let ret:keyInfo = new keyInfo();
        if (this._isValidKey(where[m.primaryKey])) {
            ret.pid = where[m.primaryKey];
        }
        if (this._isValidKey(where[m.aggregateKey])) {
            ret.aid = where[m.aggregateKey];
        }

        return ret
    }

    // where 里的参数只允许是主键或者聚合键。主键优于聚合键
    get(table: string, where: { [key: string]: number }) {
        let keyInfo = this._mustGetKeyInfo(table, where)
        console.log(keyInfo)
        // promise
        mySqlUtil.select(["*"], table, where).then((result: any) => {
            console.log(result)
        })
    }
}

let dataProxy: DataProxy = new DataProxy();
export default dataProxy;