import * as redis from 'redis';
import log4Util from './Log4Util';
var databaseConfig = require('../config/redis.config');  //引入数据库配置模块中的数据

const client = redis.createClient(databaseConfig);

client.on('error', err => {
    //console.error(`Error: ${err}`);
});

client.on('ready', res => {
    //console.info('Redis connect ready');
});

client.on('connect', () => {
    //console.log('Redis connected!');
});

export class RedisUtil {

    constructor() {
    }

    set(key: string, value: any, cb?: redis.Callback<'OK'>) {
        value = JSON.stringify(value);
        client.set(key, value);
    }

    get(key: string, cb: any) {
        client.get(key, function (err, replay) {
            if (err) {
                cb(err, null);
            } else {
                replay = JSON.parse(replay);
                cb(null, replay);
            }
        });
    }

    setHmset(key: string, value: any) {
        client.hmset(key, value);
    }

    getHget(key: string, cb: any) {
        client.hmget(key, function (err, replay) {
            cb(null, replay);
        })
    }

    hSetKey = (key: any, value: any) => {
        return new Promise((resolve, reject) => {
            client.hmset(key, value, (err, reply) => {
                if (err) reject(err);
                resolve(reply);
            });
        });
    };

    hGetValue = (name: any, key: any) => {
        return new Promise((resolve, reject) => {
            client.hmget(name, key, (err, reply) => {
                if (err) reject(err);
                resolve(reply);
            });
        });
    };


    //----列表
    /**获取指定键列表长度 */
    listSize(listKey: any, cb: any) {
        client.llen(listKey, function (err, replay) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, replay);
            }
        });
    }

    /**向redis末尾插入整个数组，其数组中为多条string类型的json数据 */
    rpushListArry(listKey: any, list: any) {//添加整个数组
        for (let i = 0; i < list.length; i++) {
            if ((typeof list[i]) === "object") {
                list[i] = JSON.stringify(list[i]);
            }
        }
        //client.lpush(listKey, list);
        // if (list.length > 1) {
        //     client.lpush(listKey, list[0]);
        // }
        for (let i = 0; i < list.length; i++) {
            client.rpush(listKey, list[i]);
        }
        //cb(null,"set success");
        return true;
    }

    /**向表开头插入一个元素 */
    lpushListOne(listKey: any, value: any, cb: any) {
        let addValue = JSON.stringify(value);
        client.lpush(listKey, addValue, (err, ruslt) => {
            cb(err, ruslt);
        });
    }

    /**获取并删除第一个元素 */
    lpopListOne(listKey: any, cb: any) {
        client.lpop(listKey, function (err, replay) {
            if (err) {
                cb(err, null);
            } else {
                replay = JSON.parse(replay);
                cb(null, replay);
            }
        });
    }

    /**向表末尾插入单条数据 */
    rpushListOne(listKey: any, value: any, cb?: any) {//添加单个数据
        value = JSON.stringify(value);
        client.rpush(listKey, value, function (err, replay) {
            if (err) {
                if(cb){
                    cb(err, null);
                }
            } else {
                if(cb){
                    cb(err, replay);
                }
            }
        });
    }

    /**获取并删除集合末尾元素 */
    rpopListOne(listKey: any, cb: any) {
        client.rpop(listKey, function (err, replay) {
            if (err) {
                cb(err, null);
            } else {
                replay = JSON.parse(replay);
                cb(null, replay);
            }
        });
    }

    /**获取集合末尾元素 */
    rpopPushListOne(listKey: any, cb: any) {
        client.rpoplpush(listKey, listKey, function (err, replay) {
            if (err) {
                cb(err, null);
            } else {
                replay = JSON.parse(replay);
                cb(null, replay);
            }
        });
    }

    /**删除指定的元素 */
    removeListByValue(listKey: any, value: any, cb?: any) {
        value = JSON.stringify(value);
        client.lrem(listKey, 1, value, function (err, data) {
            if (data) {
                if (cb) {
                    cb(null, data);
                }
            } else {
                if (cb) {
                    cb(err, null);
                }
            }
        });
    }

    /**更新redis中的指定元素 */
    updateListValueByIndex(listKey: any, index: any, newValue: any, cb?: any) {
        newValue = JSON.stringify(newValue);
        client.lset(listKey, index, newValue, function (err, data) {
            if (err) {
                if (cb) {
                    cb(err, null);
                }
            } else {
                if (cb) {
                    cb(null, data);
                }
            }
        })
    }

    /**向指定位置插入元素 */
    insertValueByIndex(listKey: any, value: any, index: any, cb: any) {
        index = Number(index);
        value = JSON.stringify(value);
        if (index === 0) {
            client.lindex(listKey, index, function (err, result) {
                client.linsert(listKey, "BEFORE", result, value, function (err, replay) {
                    if (err) {
                        cb(err, null);
                    } else {
                        cb(null, replay);
                    }
                })
            });
        } else {
            client.lindex(listKey, index - 1, function (err, result) {
                client.linsert(listKey, "AFTER", result, value, function (err, replay) {
                    if (err) {
                        cb(err, null);
                    } else {
                        cb(null, replay);
                    }
                })
            });

        }
    }

    /**根据下标获取表中的指定数据 */
    getValueByIndex(listKey: any, index: any, cb: any) {
        client.lindex(listKey, index, function (err, replay) {
            if (err) {
                cb(err, null);
            } else {
                replay = JSON.parse(replay);
                cb(null, replay);
            }
        });
    }

    /**查询指定范围的数据 [beginInde,endIndex] */
    getListByRange(listKey: any, beginIndex: any, endIndex: any, cb: any) {
        client.lrange(listKey, beginIndex, endIndex, function (err, replay) {
            if (err) {
                cb(err, null);
            } else {
                let data = [];
                for (let i = 0; i < replay.length; i++) {
                    data.push(JSON.parse(replay[i]));
                }
                cb(null, data);
            }
        });
    }

    /**
     * 删除指定内容从0到-1就是一个不删      
     * 从-1到0就是数据全部删除,相当于del key
     */
    deletelistdata(key: string) {
        //保留指定位置的内容，其他全部删除，所以从0到-1就是一个不删； 从-1到0就是数据全部删除，相当于del key
        client.ltrim(key, -1, 0, function (err, val) {
            //console.log('delet all data in db[%s] ，finished val=[%s] ', key, val);
        });
    }

    /**使用redis事务 */
    insertListTransaction(functions: any, cb: any) {
        //functions=[client.multi(),rpush(),rpush(),rpush()]//为多条redis的执行语句，其中multi和exec为事务的开启和结束标志。
        client.multi(functions).exec(function (err, replies) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, replies);
            }
        })
    }

    /**是否有某个值 */
    hasKey(key: string, cb: (count: number) => void) {
        client.exists(key, function (err, val) {
            if(cb){
                cb(val);
            }
        })
    }

    /**设置过期时间s */
    setKeyTimeout(key: string, time: number,cb?: any) {
        client.expire(key, time, function (err, val) {
            if(cb){
                cb(val);
            }
        })
    }

    /**删除指定键 */
    deleteKey(key: any, cb?: any) {
        client.del(key, function (err, data) {
            if (cb) {
                if (err) {
                    if(cb){
                        cb(err, null);
                    }
                } else {
                    if(cb){
                        cb(null, data);
                    }
                }
            }
        })
    }

}
let redisUtil = new RedisUtil();
export default redisUtil;