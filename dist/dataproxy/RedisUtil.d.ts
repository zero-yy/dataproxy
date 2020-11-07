import * as redis from 'redis';
export declare class RedisUtil {
    constructor();
    setex(key: string, seconds: number, value: any): void;
    set(key: string, value: any, cb?: redis.Callback<'OK'>): void;
    getObjectWithPromise(key: string): Promise<object | null>;
    get(key: string, cb: any): void;
    setHmset(key: string, value: any): void;
    getHget(key: string, cb: any): void;
    hSetKey: (key: any, value: any) => Promise<unknown>;
    hGetValue: (name: any, key: any) => Promise<unknown>;
    /**获取指定键列表长度 */
    listSize(listKey: any, cb: any): void;
    /**向redis末尾插入整个数组，其数组中为多条string类型的json数据 */
    rpushListArry(listKey: any, list: any): boolean;
    /**向表开头插入一个元素 */
    lpushListOne(listKey: any, value: any, cb: any): void;
    /**获取并删除第一个元素 */
    lpopListOne(listKey: any, cb: any): void;
    /**向表末尾插入单条数据 */
    rpushListOne(listKey: any, value: any, cb?: any): void;
    /**获取并删除集合末尾元素 */
    rpopListOne(listKey: any, cb: any): void;
    /**获取集合末尾元素 */
    rpopPushListOne(listKey: any, cb: any): void;
    /**删除指定的元素 */
    removeListByValue(listKey: any, value: any, cb?: any): void;
    /**更新redis中的指定元素 */
    updateListValueByIndex(listKey: any, index: any, newValue: any, cb?: any): void;
    /**向指定位置插入元素 */
    insertValueByIndex(listKey: any, value: any, index: any, cb: any): void;
    /**根据下标获取表中的指定数据 */
    getValueByIndex(listKey: any, index: any, cb: any): void;
    /**查询指定范围的数据 [beginInde,endIndex] */
    getListByRange(listKey: any, beginIndex: any, endIndex: any, cb: any): void;
    /**
     * 删除指定内容从0到-1就是一个不删
     * 从-1到0就是数据全部删除,相当于del key
     */
    deletelistdata(key: string): void;
    /**使用redis事务 */
    insertListTransaction(functions: any, cb: any): void;
    /**是否有某个值 */
    hasKey(key: string, cb: (count: number) => void): void;
    /**设置过期时间s */
    setKeyTimeout(key: string, time: number, cb?: any): void;
    /**删除指定键 */
    deleteKey(key: any, cb?: any): void;
}
declare let redisUtil: RedisUtil;
export default redisUtil;
