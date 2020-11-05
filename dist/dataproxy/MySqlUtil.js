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
exports.MySqlUtil = void 0;
var mysql = __importStar(require("mysql"));
var Log4Util_1 = __importDefault(require("./Log4Util"));
var databaseConfig = require('../config/mysql.config'); //引入数据库配置模块中的数据
var pool = mysql.createPool(databaseConfig);
var MySqlUtil = /** @class */ (function () {
    function MySqlUtil() {
    }
    MySqlUtil.prototype.responseDoReturn = function (res, result, resultJSON) {
        if (typeof result === 'undefined') {
            res.json({
                code: '201',
                msg: 'failed to do'
            });
        }
        else {
            res.json(result);
        }
    };
    ;
    MySqlUtil.prototype.query = function (sql) {
        // sql = String
        //console.log("sql",sql)
        return this._operation(sql);
    };
    MySqlUtil.prototype.selectOrInsert = function (array, table, where, insertInfo, link) {
        var _this = this;
        if (link === void 0) { link = 'AND'; }
        return new Promise(function (resolve, reject) {
            _this.select(array, table, where).then(function (result) {
                if (result.length === 0) {
                    _this.insert(insertInfo, table).then(function (res) {
                        resolve(_this.selectOrInsert(array, table, where, insertInfo));
                    }).catch(function (err) {
                        resolve({ code: -1, result: 'error' });
                    });
                }
                else {
                    resolve({ code: 1, result: result[0] });
                }
            });
        });
    };
    MySqlUtil.prototype.select = function (array, table, where, link) {
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
    MySqlUtil.prototype.insert = function (insertInfo, table) {
        // info = { key: value }
        // table = String
        var sql = "INSERT INTO " + table + "(";
        var keyArray = [];
        var valueArray = [];
        Object.keys(insertInfo).forEach(function (key) {
            keyArray.push(key);
            valueArray.push(mysql.escape(insertInfo[key]));
        });
        var keyStr = keyArray.join(',');
        var valueStr = valueArray.join(',');
        sql += keyStr + ') ';
        sql += 'VALUES(' + valueStr + ')';
        return this._operation(sql);
    };
    MySqlUtil.prototype.update = function (info, table, where, link) {
        if (link === void 0) { link = 'AND'; }
        var sql = "UPDATE " + table + " SET ";
        var sqlArray = [];
        Object.keys(info).forEach(function (key) {
            sqlArray.push(key + "='" + info[key] + "'");
        });
        sql += sqlArray.join(',');
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        //console.log("sql",sql)
        return this._operation(sql);
    };
    MySqlUtil.prototype.delete = function (table, where, link, info) {
        if (link === void 0) { link = 'AND'; }
        // info = { key: value }
        // table = String
        // where = { key: value }
        // link = 'AND' or 'OR' default 'AND'
        var sql = "DELETE FROM " + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    };
    MySqlUtil.prototype._operation = function (sql) {
        if (sql.indexOf("nums='-'") != -1
            || sql.indexOf("SET nums='-'") != -1) {
            Log4Util_1.default.erroLogger("sql...cmd:" + sql);
        }
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
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
            });
        });
    };
    MySqlUtil.prototype._handleWhereString = function (where, link) {
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
    // query(sql:any, callback:any) {
    //     pool.getConnection(function(err, connection) {
    //         connection.query(sql, function(err, rows) {
    //             callback(err, rows);
    //             //释放链接
    //             connection.release();
    //         });
    //     });
    // }
    MySqlUtil.prototype.queryArgs = function (sql, args, callback) {
        pool.getConnection(function (err, connection) {
            connection.query(sql, args, function (err, rows) {
                callback(err, rows);
                //释放链接
                connection.release();
            });
        });
    };
    return MySqlUtil;
}());
exports.MySqlUtil = MySqlUtil;
var mySqlUtil = new MySqlUtil();
exports.default = mySqlUtil;
