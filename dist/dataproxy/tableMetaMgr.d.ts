import TabelMeta from "./tableMeta";
export declare class TabelMetaMgr {
    private mDataConfig;
    hasMeta(name: string): boolean;
    getMeta(name: string): TabelMeta;
    getConfig(): Map<string, TabelMeta>;
    mustLoadConfig(configFileName: string): void;
}
declare let tableMetaMgr: TabelMetaMgr;
export default tableMetaMgr;
