"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProxy = void 0;
var mysql = __importStar(require("mysql"));
var MySqlUtil_1 = __importDefault(require("./MySqlUtil"));
var RedisUtil_1 = __importDefault(require("./RedisUtil"));
var tableMetaMgr_1 = __importDefault(require("./tableMetaMgr"));
var databaseConfig = require('../config/mysql.config'); //引入数据库配置模块中的数据
var pool = mysql.createPool(databaseConfig);
// 无效id
var InvalidId = -1;
// 键信息
var KeyInfo = /** @class */ (function () {
    function KeyInfo() {
        this.pid = InvalidId;
        this.aid = InvalidId;
    }
    return KeyInfo;
}());
// 数据库版本信息，，只有大版本更换的时候才需要更新
// 变相的清空了redis
var DbVersion = 'v1';
// 缺省join模式
var DefaultLink = 'AND';
var MatchAll = ['*'];
var UnknownErrStr = 'unknown dbProxy err';
// 7天过期
var DbExpireTtlSeconds = 24 * 3600 * 7;
// 空对象的过期时间，，用于防治缓存打穿
var NullExpireTtlSeconds = 4 * 3600;
// TODO 可以替换为其他日志
function dpErrLog(str) {
    // log4Util.erroLogger(str)
    console.error('[DPLOG]' + str);
}
function dpDebugLog(str) {
    console.debug(str);
}
// 主键pid, 聚合键aid
// where 里的参数只允许是主键或者聚合键。主键优于聚合键
var DataProxy = /** @class */ (function () {
    function DataProxy() {
    }
    // 判断key，至少有一个有长度或者是数字
    DataProxy.prototype._isValidKey = function (v) {
        var t = typeof v;
        if (t === 'number') {
            return true;
        }
        return false;
    };
    DataProxy.prototype._redisKeyPid = function (tableName, pid) {
        var str = "db" + DbVersion + ":" + tableName + ":pid:[" + pid + "]";
        return str;
    };
    DataProxy.prototype._redisKeyAid2Pids = function (tableName, aid) {
        var str = "db" + DbVersion + ":" + tableName + ":aid:[" + aid + "]";
        return str;
    };
    // 该函数检测数据不合法时会抛出异常，第一时间报错
    // 异常的方式不太好，调用者需要catch e，然后打断操作
    DataProxy.prototype._mustGetKeyInfo = function (tableName, where) {
        if (where == null || where.length == 0) {
            throw new Error("need where");
        }
        if (!tableMetaMgr_1.default.hasMeta(tableName)) {
            var e = "not found tableName meta [" + tableName + "]";
            throw new Error(e);
        }
        var m = tableMetaMgr_1.default.getMeta(tableName);
        // 判断key，至少有一个有长度或者是数字
        if (!this._isValidKey(where[m.primaryKey]) && !this._isValidKey(where[m.aggregateKey])) {
            var e = "need valid primaryKey or aggregateKey: [" + JSON.stringify(where) + "]";
            throw new Error(e);
        }
        // 判断是否有多余key，不允许有多余key
        for (var key in where) {
            if (key != m.primaryKey && key != m.aggregateKey) {
                var e = "unknown key[" + key + "] for tableName [" + tableName + "]";
                throw new Error(e);
            }
        }
        var ret = new KeyInfo();
        if (this._isValidKey(where[m.primaryKey])) {
            ret.pid = where[m.primaryKey];
        }
        if (this._isValidKey(where[m.aggregateKey])) {
            ret.aid = where[m.aggregateKey];
        }
        return ret;
    };
    // 如果包含主键pid，则返回单项数据
    // 否则，如果是聚合键aid，则返回数组
    // 如果错误，则一般会内部打印堆栈，同时会返回出具体的错误字符串信息
    DataProxy.prototype.get = function (tableName, where) {
        var keyInfo = new KeyInfo();
        try {
            keyInfo = this._mustGetKeyInfo(tableName, where);
        }
        catch (err) {
            dpErrLog(err.stack);
            return Promise.reject(err.message);
        }
        // promise
        if (keyInfo.pid != InvalidId) {
            return this.getOne(tableName, keyInfo.pid);
        }
        else if (keyInfo.aid != InvalidId) {
            return this.getMore(tableName, keyInfo.aid);
        }
        return Promise.reject(UnknownErrStr);
    };
    // result: single object, like {id:2, value:3}, if not exist, return null
    // err: string
    DataProxy.prototype.getOne = function (tableName, pid) {
        var pidKey = tableMetaMgr_1.default.getPidKey(tableName);
        if (pidKey.length == 0) {
            return Promise.reject('no pid key');
        }
        // get from redis
        var redisKey = this._redisKeyPid(tableName, pid);
        return RedisUtil_1.default
            .getObjectWithPromise(redisKey)
            .then(function (result) {
            var _a;
            if (result !== null) {
                dpDebugLog("loaded from redis: " + JSON.stringify(result));
                // 返回的有效数据里必须包含键值
                if (result.hasOwnProperty(pidKey)) {
                    // refresh ttl
                    RedisUtil_1.default.setKeyTimeout(redisKey, DbExpireTtlSeconds);
                    return result;
                }
                else {
                    return null;
                }
            }
            // 只有数据彻底为空，才会走数据库
            // get from db
            return MySqlUtil_1.default.select(MatchAll, tableName, (_a = {}, _a[pidKey] = pid, _a)).then(function (result) {
                dpDebugLog("loaded from db: " + JSON.stringify(result));
                // store into redis
                if (result.length > 0) {
                    RedisUtil_1.default.setex(redisKey, DbExpireTtlSeconds, result[0]);
                    return result[0];
                }
                // 没有报错，而且没找到的时候，应该往redis放一个空对象，避免缓存打穿
                RedisUtil_1.default.setex(redisKey, NullExpireTtlSeconds, {});
                return null;
            });
        })
            .catch(function (err) {
            return null;
        });
    };
    DataProxy.prototype.getMore = function (tableName, aid) {
        return Promise.reject(UnknownErrStr);
    };
    return DataProxy;
}());
exports.DataProxy = DataProxy;
var dataProxy = new DataProxy();
exports.default = dataProxy;
