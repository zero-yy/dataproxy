import * as mysql from 'mysql';
import log4Util from './Log4Util';
var databaseConfig = require('../config/mysql.config');  //引入数据库配置模块中的数据
var pool = mysql.createPool(databaseConfig);

export class MySqlUtil {

    constructor() {
    }

    responseDoReturn(res: any, result: any, resultJSON: any) {
        if (typeof result === 'undefined') {
            res.json({
                code: '201',
                msg: 'failed to do'
            });
        } else {
            res.json(result);
        }
    };

    query(sql: string) {
        // sql = String
        //console.log("sql",sql)
        return this._operation(sql);
    }

    selectOrInsert(array: string[], table: string, where: { [key: string]: string | number }, insertInfo: { [key: string]: string | number }, link: 'AND' | 'OR' = 'AND') {
        return new Promise((resolve, reject) => {
            this.select(array, table, where).then((result: any) => {
                if (result.length === 0) {
                    this.insert(insertInfo, table).then(res => {
                        resolve(this.selectOrInsert(array, table, where, insertInfo));
                    }).catch(err => {
                        resolve({ code: -1, result: 'error' });
                    });
                } else {
                    resolve({ code: 1, result: result[0] });
                }
            });
        });
    }

    select(array: string[] = [], table: string, where?: { [key: string]: string | number }, link: 'AND' | 'OR' = 'AND') {
        // array = Array
        // table = String
        // where = { key: value }
        // link = 'AND' or 'OR' default 'AND'
        let sql = "SELECT ";
        array.forEach(((value, index) => {
            if (index === 0) {
                sql += value;
            } else {
                sql += ',' + value
            }
        }));
        sql += ' FROM ' + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    }

    insert(insertInfo: { [key: string]: string | number | Buffer }, table: string) {
        // info = { key: value }
        // table = String
        let sql = "INSERT INTO " + table + "(";
        let keyArray: any = [];
        let valueArray: any = [];
        Object.keys(insertInfo).forEach((key) => {
            keyArray.push(key);
            valueArray.push(mysql.escape(insertInfo[key]));
        });
        let keyStr = keyArray.join(',');
        let valueStr = valueArray.join(',');
        sql += keyStr + ') ';
        sql += 'VALUES(' + valueStr + ')';
        return this._operation(sql);
    }

    update(info: { [key: string]: string | number | Buffer }, table: string, where?: { [key: string]: string | number }, link: 'AND' | 'OR' = 'AND') {
        let sql = "UPDATE " + table + " SET ";
        let sqlArray: any = [];
        Object.keys(info).forEach((key) => {
            sqlArray.push(key + "='" + info[key] + "'");
        });
        sql += sqlArray.join(',');
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        //console.log("sql",sql)
        return this._operation(sql);
    }

    delete(table: any, where: { [key: string]: string | number }, link: 'AND' | 'OR' = 'AND', info?: { [key: string]: string | number }) {
        // info = { key: value }
        // table = String
        // where = { key: value }
        // link = 'AND' or 'OR' default 'AND'
        let sql = "DELETE FROM " + table;
        if (where) {
            sql += this._handleWhereString(where, link);
        }
        return this._operation(sql);
    }

    _operation(sql: any) {
        if(sql.indexOf("nums='-'") != -1
        || sql.indexOf("SET nums='-'") != -1){
            log4Util.erroLogger("sql...cmd:" + sql);
        }
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                connection.query(sql, (error: any, result: any, fields: any) => {
                    if (error) {
                        console.log(error.message);
                        reject(error.message);
                    } else {
                        resolve(result);
                    }
                    //释放链接
                    connection.release();
                });
            });
        })
    }

    _handleWhereString(where: { [key: string]: string | number }, link: 'AND' | 'OR' = 'AND') {
        let str = "";
        let whereArray: any = [];
        Object.keys(where).forEach((key) => {
            //console.log("key",key)
            whereArray.push(String(key + "=" + mysql.escape(where[key])));
        });
        if (link) {
            let whereStr = whereArray.join(" " + link + " ");
            str += " WHERE " + whereStr;
        } else {
            let whereStr = whereArray.join(" AND ");
            str += " WHERE " + whereStr;
        }
        //console.log("key",str)
        return str;
    }

    // query(sql:any, callback:any) {
    //     pool.getConnection(function(err, connection) {
    //         connection.query(sql, function(err, rows) {
    //             callback(err, rows);
    //             //释放链接
    //             connection.release();
    //         });
    //     });
    // }

    queryArgs(sql: any, args: any, callback: any) {
        pool.getConnection(function (err, connection) {
            connection.query(sql, args, function (err, rows) {
                callback(err, rows);
                //释放链接
                connection.release();
            });
        });
    }


    // query(sql, params, callback) {
    //     //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
    //     var connection = mysql.createConnection(databaseConfig);
    //     connection.connect(function (err) {
    //         if (err) {
    //             console.log('数据库链接失败');
    //             throw err;
    //         }
    //         //开始数据操作
    //         //传入三个参数，第一个参数sql语句，第二个参数sql语句中需要的数据，第三个参数回调函数
    //         connection.query(sql, params, function (err, results, fields) {
    //             if (err) {
    //                 console.log('数据操作失败');
    //                 throw err;
    //             }
    //             //将查询出来的数据返回给回调函数
    //             callback && callback(results, fields);
    //             //results作为数据操作后的结果，fields作为数据库连接的一些字段
    //             //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
    //             connection.end(function (err) {
    //                 if (err) {
    //                     console.log('关闭数据库连接失败！');
    //                     throw err;
    //                 }
    //             });
    //         });
    //     });
    // };
}
let mySqlUtil: MySqlUtil = new MySqlUtil();
export default mySqlUtil;