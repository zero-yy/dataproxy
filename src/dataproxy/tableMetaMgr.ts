import TabelMeta from "./tableMeta";

export class TabelMetaMgr {
    private mDataConfig: Map<string, TabelMeta> = new Map();

    hasMeta(name:string):boolean {
        return this.mDataConfig.has(name)
    }

    getMeta(name:string): TabelMeta {
        return this.mDataConfig.get(name)
    }

    getConfig(): Map<string, TabelMeta> {
        return this.mDataConfig
    }

    // 失败时，直接抛出异常
    mustLoadConfig(configFileName: string) {
        var metas = require(configFileName)
        // console.log(metas)

        // 需要传递this进去
        metas.forEach(function(meta) {
            let m :TabelMeta = new TabelMeta();
            m.name = meta.name;
            m.primaryKey = meta.primaryKey;
            m.aggregateKey = meta.aggregateKey;

            if (m.name == undefined || m.primaryKey == undefined || m.aggregateKey == undefined) {
                throw new Error("table meta config err: " + JSON.stringify(m))
            }
            if (m.name == null || m.primaryKey == null) {
                throw new Error("meta config err")
            }

            //todo 连接数据库，检查表和主键等信息是否正确

            this.mDataConfig.set(m.name, m)
        }, this);

        // map打印有点特殊
        console.log("TableMetaMgr loaded config:")
        console.log(this.mDataConfig)
    }
}

// singleton
let tableMetaMgr: TabelMetaMgr = new TabelMetaMgr();
export default tableMetaMgr;