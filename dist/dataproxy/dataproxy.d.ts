declare class keyInfo {
    pid: number;
    aid: number;
}
export declare class DataProxy {
    constructor();
    _isValidKey(v: number | undefined): boolean;
    _mustGetKeyInfo(tableName: string, where: {
        [key: string]: number;
    }): keyInfo;
    get(table: string, where: {
        [key: string]: number;
    }): void;
}
declare let dataProxy: DataProxy;
export default dataProxy;
