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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisUtil = void 0;
var redis = __importStar(require("redis"));
var databaseConfig = require('../config/redis.config'); //引入数据库配置模块中的数据
var client = redis.createClient(databaseConfig);
client.on('error', function (err) {
    //console.error(`Error: ${err}`);
});
client.on('ready', function (res) {
    //console.info('Redis connect ready');
});
client.on('connect', function () {
    //console.log('Redis connected!');
});
var RedisUtil = /** @class */ (function () {
    function RedisUtil() {
        this.hSetKey = function (key, value) {
            return new Promise(function (resolve, reject) {
                client.hmset(key, value, function (err, reply) {
                    if (err)
                        reject(err);
                    resolve(reply);
                });
            });
        };
        this.hGetValue = function (name, key) {
            return new Promise(function (resolve, reject) {
                client.hmget(name, key, function (err, reply) {
                    if (err)
                        reject(err);
                    resolve(reply);
                });
            });
        };
    }
    RedisUtil.prototype.set = function (key, value, cb) {
        value = JSON.stringify(value);
        client.set(key, value);
    };
    RedisUtil.prototype.get = function (key, cb) {
        client.get(key, function (err, replay) {
            if (err) {
                cb(err, null);
            }
            else {
                replay = JSON.parse(replay);
                cb(null, replay);
            }
        });
    };
    RedisUtil.prototype.setHmset = function (key, value) {
        client.hmset(key, value);
    };
    RedisUtil.prototype.getHget = function (key, cb) {
        client.hmget(key, function (err, replay) {
            cb(null, replay);
        });
    };
    //----列表
    /**获取指定键列表长度 */
    RedisUtil.prototype.listSize = function (listKey, cb) {
        client.llen(listKey, function (err, replay) {
            if (err) {
                cb(err, null);
            }
            else {
                cb(null, replay);
            }
        });
    };
    /**向redis末尾插入整个数组，其数组中为多条string类型的json数据 */
    RedisUtil.prototype.rpushListArry = function (listKey, list) {
        for (var i = 0; i < list.length; i++) {
            if ((typeof list[i]) === "object") {
                list[i] = JSON.stringify(list[i]);
            }
        }
        //client.lpush(listKey, list);
        // if (list.length > 1) {
        //     client.lpush(listKey, list[0]);
        // }
        for (var i = 0; i < list.length; i++) {
            client.rpush(listKey, list[i]);
        }
        //cb(null,"set success");
        return true;
    };
    /**向表开头插入一个元素 */
    RedisUtil.prototype.lpushListOne = function (listKey, value, cb) {
        var addValue = JSON.stringify(value);
        client.lpush(listKey, addValue, function (err, ruslt) {
            cb(err, ruslt);
        });
    };
    /**获取并删除第一个元素 */
    RedisUtil.prototype.lpopListOne = function (listKey, cb) {
        client.lpop(listKey, function (err, replay) {
            if (err) {
                cb(err, null);
            }
            else {
                replay = JSON.parse(replay);
                cb(null, replay);
            }
        });
    };
    /**向表末尾插入单条数据 */
    RedisUtil.prototype.rpushListOne = function (listKey, value, cb) {
        value = JSON.stringify(value);
        client.rpush(listKey, value, function (err, replay) {
            if (err) {
                if (cb) {
                    cb(err, null);
                }
            }
            else {
                if (cb) {
                    cb(err, replay);
                }
            }
        });
    };
    /**获取并删除集合末尾元素 */
    RedisUtil.prototype.rpopListOne = function (listKey, cb) {
        client.rpop(listKey, function (err, replay) {
            if (err) {
                cb(err, null);
            }
            else {
                replay = JSON.parse(replay);
                cb(null, replay);
            }
        });
    };
    /**获取集合末尾元素 */
    RedisUtil.prototype.rpopPushListOne = function (listKey, cb) {
        client.rpoplpush(listKey, listKey, function (err, replay) {
            if (err) {
                cb(err, null);
            }
            else {
                replay = JSON.parse(replay);
                cb(null, replay);
            }
        });
    };
    /**删除指定的元素 */
    RedisUtil.prototype.removeListByValue = function (listKey, value, cb) {
        value = JSON.stringify(value);
        client.lrem(listKey, 1, value, function (err, data) {
            if (data) {
                if (cb) {
                    cb(null, data);
                }
            }
            else {
                if (cb) {
                    cb(err, null);
                }
            }
        });
    };
    /**更新redis中的指定元素 */
    RedisUtil.prototype.updateListValueByIndex = function (listKey, index, newValue, cb) {
        newValue = JSON.stringify(newValue);
        client.lset(listKey, index, newValue, function (err, data) {
            if (err) {
                if (cb) {
                    cb(err, null);
                }
            }
            else {
                if (cb) {
                    cb(null, data);
                }
            }
        });
    };
    /**向指定位置插入元素 */
    RedisUtil.prototype.insertValueByIndex = function (listKey, value, index, cb) {
        index = Number(index);
        value = JSON.stringify(value);
        if (index === 0) {
            client.lindex(listKey, index, function (err, result) {
                client.linsert(listKey, "BEFORE", result, value, function (err, replay) {
                    if (err) {
                        cb(err, null);
                    }
                    else {
                        cb(null, replay);
                    }
                });
            });
        }
        else {
            client.lindex(listKey, index - 1, function (err, result) {
                client.linsert(listKey, "AFTER", result, value, function (err, replay) {
                    if (err) {
                        cb(err, null);
                    }
                    else {
                        cb(null, replay);
                    }
                });
            });
        }
    };
    /**根据下标获取表中的指定数据 */
    RedisUtil.prototype.getValueByIndex = function (listKey, index, cb) {
        client.lindex(listKey, index, function (err, replay) {
            if (err) {
                cb(err, null);
            }
            else {
                replay = JSON.parse(replay);
                cb(null, replay);
            }
        });
    };
    /**查询指定范围的数据 [beginInde,endIndex] */
    RedisUtil.prototype.getListByRange = function (listKey, beginIndex, endIndex, cb) {
        client.lrange(listKey, beginIndex, endIndex, function (err, replay) {
            if (err) {
                cb(err, null);
            }
            else {
                var data = [];
                for (var i = 0; i < replay.length; i++) {
                    data.push(JSON.parse(replay[i]));
                }
                cb(null, data);
            }
        });
    };
    /**
     * 删除指定内容从0到-1就是一个不删
     * 从-1到0就是数据全部删除,相当于del key
     */
    RedisUtil.prototype.deletelistdata = function (key) {
        //保留指定位置的内容，其他全部删除，所以从0到-1就是一个不删； 从-1到0就是数据全部删除，相当于del key
        client.ltrim(key, -1, 0, function (err, val) {
            //console.log('delet all data in db[%s] ，finished val=[%s] ', key, val);
        });
    };
    /**使用redis事务 */
    RedisUtil.prototype.insertListTransaction = function (functions, cb) {
        //functions=[client.multi(),rpush(),rpush(),rpush()]//为多条redis的执行语句，其中multi和exec为事务的开启和结束标志。
        client.multi(functions).exec(function (err, replies) {
            if (err) {
                cb(err, null);
            }
            else {
                cb(null, replies);
            }
        });
    };
    /**是否有某个值 */
    RedisUtil.prototype.hasKey = function (key, cb) {
        client.exists(key, function (err, val) {
            if (cb) {
                cb(val);
            }
        });
    };
    /**设置过期时间s */
    RedisUtil.prototype.setKeyTimeout = function (key, time, cb) {
        client.expire(key, time, function (err, val) {
            if (cb) {
                cb(val);
            }
        });
    };
    /**删除指定键 */
    RedisUtil.prototype.deleteKey = function (key, cb) {
        client.del(key, function (err, data) {
            if (cb) {
                if (err) {
                    if (cb) {
                        cb(err, null);
                    }
                }
                else {
                    if (cb) {
                        cb(null, data);
                    }
                }
            }
        });
    };
    return RedisUtil;
}());
exports.RedisUtil = RedisUtil;
var redisUtil = new RedisUtil();
exports.default = redisUtil;
