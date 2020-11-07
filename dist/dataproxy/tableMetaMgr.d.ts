import TableMeta from "./tableMeta";
export declare class TableMetaMgr {
    private mDataConfig;
    hasMeta(name: string): boolean;
    getMeta(name: string): TableMeta;
    getPidKey(table: string): string;
    getAidKey(table: string): string;
    getConfig(): Map<string, TableMeta>;
    mustLoadConfig(configFileName: string): void;
}
declare let tableMetaMgr: TableMetaMgr;
export default tableMetaMgr;
