import TabelMeta from "./tableMeta";
export default class TabelMetaMgr {
    mDataConfig: Map<string, TabelMeta>;
    loadConfig(configFileName: string): void;
}
