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
var tableMetaMgr_1 = __importDefault(require("./tableMetaMgr"));
var databaseConfig = require('../config/mysql.config'); //引入数据库配置模块中的数据
var pool = mysql.createPool(databaseConfig);
// 无效id
var InvalidId = -1;
// 键信息
var keyInfo = /** @class */ (function () {
    function keyInfo() {
        this.pid = InvalidId;
        this.aid = InvalidId;
    }
    return keyInfo;
}());
// 缺省join模式
var DefaultLink = 'AND';
var DataProxy = /** @class */ (function () {
    function DataProxy() {
    }
    // 判断key，至少有一个有长度或者是数字
    DataProxy.prototype._isValidKey = function (v) {
        var t = typeof v;
        if (t === "number") {
            return true;
        }
        return false;
    };
    // where 里的参数只允许是主键或者聚合键。主键优于聚合键
    // 该函数检测数据不合法时会抛出异常，第一时间报错
    DataProxy.prototype._mustGetKeyInfo = function (tableName, where) {
        if (where == null || where.length == 0) {
            throw new Error("need where");
        }
        if (!tableMetaMgr_1.default.hasMeta(tableName)) {
            throw new Error("not found table meta [" + tableName + "]");
        }
        var m = tableMetaMgr_1.default.getMeta(tableName);
        // 判断key，至少有一个有长度或者是数字
        if (!this._isValidKey(where[m.primaryKey]) && !this._isValidKey(where[m.aggregateKey])) {
            throw new Error("need valid primaryKey or aggregateKey: [" + where + "]");
        }
        // 判断是否有多余key，不允许有多余key
        for (var key in where) {
            if (key != m.primaryKey && key != m.aggregateKey) {
                throw new Error("unknown key[" + key + "] for table [" + tableName + "]");
            }
        }
        var ret = new keyInfo();
        if (this._isValidKey(where[m.primaryKey])) {
            ret.pid = where[m.primaryKey];
        }
        if (this._isValidKey(where[m.aggregateKey])) {
            ret.aid = where[m.aggregateKey];
        }
        return ret;
    };
    // where 里的参数只允许是主键或者聚合键。主键优于聚合键
    DataProxy.prototype.get = function (table, where) {
        var keyInfo = this._mustGetKeyInfo(table, where);
        console.log(keyInfo);
        // promise
        MySqlUtil_1.default.select(["*"], table, where).then(function (result) {
            console.log(result);
        });
    };
    return DataProxy;
}());
exports.DataProxy = DataProxy;
var dataProxy = new DataProxy();
exports.default = dataProxy;
