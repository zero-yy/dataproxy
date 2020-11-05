import * as mysql from 'mysql';
import log4Util from './Log4Util';
var databaseConfig = require('../config/mysql.config');  //引入数据库配置模块中的数据
var pool = mysql.createPool(databaseConfig);

export class DataProxy {
    constructor() {
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
}

let dataProxy: DataProxy = new DataProxy();
export default dataProxy;