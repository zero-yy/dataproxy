declare class KeyInfo {
    pid: number;
    aid: number;
}
export declare class DataProxy {
    constructor();
    _isValidKey(v: number | undefined): boolean;
    _redisKeyPid(tableName: string, pid: number): string;
    _redisKeyAid2Pids(tableName: string, aid: number): string;
    _mustGetKeyInfo(tableName: string, where: {
        [key: string]: number;
    }): KeyInfo;
    get(tableName: string, where: {
        [key: string]: number;
    }): Promise<unknown>;
    getOne(tableName: string, pid: number): Promise<any>;
    getMore(tableName: string, aid: number): Promise<object>;
}
declare let dataProxy: DataProxy;
export default dataProxy;
