import TableMeta from "./tableMeta";

export class TableMetaMgr {
    private mDataConfig: Map<string, TableMeta> = new Map();

    hasMeta(name:string):boolean {
        return this.mDataConfig.has(name)
    }

    getMeta(name:string): TableMeta {
        return this.mDataConfig.get(name)
    }

    // 没找到则返回""
    getPidKey(table: string): string {
        let m = this.getMeta(table)
        if (m == undefined) {
            return ""
        }
        return m.primaryKey;
    }

    // 没找到则返回""
    getAidKey(table: string): string {
        let m = this.getMeta(table)
        if (m == undefined) {
            return ""
        }
        return m.aggregateKey
    }

    getConfig(): Map<string, TableMeta> {
        return this.mDataConfig
    }

    // 失败时，直接抛出异常
    mustLoadConfig(configFileName: string) {
        var metas = require(configFileName)
        // console.log(metas)

        // 需要传递this进去
        metas.forEach(function(meta) {
            let m :TableMeta = new TableMeta();
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
let tableMetaMgr: TableMetaMgr = new TableMetaMgr();
export default tableMetaMgr;