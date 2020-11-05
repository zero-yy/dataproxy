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
var Log4Util_1 = __importDefault(require("./Log4Util"));
var tableMetaMgr_1 = __importDefault(require("./tableMetaMgr"));
var databaseConfig = require('../config/mysql.config'); //引入数据库配置模块中的数据
var pool = mysql.createPool(databaseConfig);
var DataProxy = /** @class */ (function () {
    function DataProxy() {
        this.mTableMetaMgr = new tableMetaMgr_1.default();
    }
    DataProxy.prototype.select = function (array, table, where, link) {
        if (array === void 0) { array = []; }
        if (link === void 0) { link = 'AND'; }
        // array = Array
        // table = String
        // where = { key: value }
        // link = 'AND' or 'OR' default 'AND'
        var sql = "SELECT ";
        array.forEach((function (value, index) {
            if (index === 0) {
                sql += value;
            }
            else {
                sql += ',' + value;
            }
        }));
        sql += ' FROM ' + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    };
    DataProxy.prototype._operation = function (sql) {
        // no need
        if (sql.indexOf("nums='-'") != -1
            || sql.indexOf("SET nums='-'") != -1) {
            Log4Util_1.default.erroLogger("sql...cmd:" + sql);
        }
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                }
                else {
                    connection.query(sql, function (error, result, fields) {
                        if (error) {
                            console.log(error.message);
                            reject(error.message);
                        }
                        else {
                            resolve(result);
                        }
                        //释放链接
                        connection.release();
                    });
                }
            });
        });
    };
    DataProxy.prototype._handleWhereString = function (where, link) {
        if (link === void 0) { link = 'AND'; }
        var str = "";
        var whereArray = [];
        Object.keys(where).forEach(function (key) {
            //console.log("key",key)
            whereArray.push(String(key + "=" + mysql.escape(where[key])));
        });
        if (link) {
            var whereStr = whereArray.join(" " + link + " ");
            str += " WHERE " + whereStr;
        }
        else {
            var whereStr = whereArray.join(" AND ");
            str += " WHERE " + whereStr;
        }
        //console.log("key",str)
        return str;
    };
    return DataProxy;
}());
exports.DataProxy = DataProxy;
var dataProxy = new DataProxy();
exports.default = dataProxy;
