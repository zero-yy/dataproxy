import { exit } from "process";
import TabelMeta from "./tableMeta";

export default class TabelMetaMgr {
    mDataConfig: Map<string, TabelMeta> = new Map();

    loadConfig(configFileName: string) {
        var metas = require(configFileName)
        // console.log(metas)

        // 需要传递this进去
        metas.forEach(function(meta) {
            let m :TabelMeta = new TabelMeta();
            m.name = meta.name;
            m.primaryKey = meta.primaryKey;
            m.aggregateKey = meta.aggregateKey;

            if (m.name == undefined || m.primaryKey == undefined || m.aggregateKey == undefined) {
                console.error("table meta config err: " + JSON.stringify(m))
                exit(0)
            }
            if (m.name == null || m.primaryKey == null) {
                console.error("meta config err")
                exit(0)
            }

            //todo 连接数据库，检查表和主键等信息是否正确

            this.mDataConfig[m.name] = m
        }, this);

        console.log(this.mDataConfig)
    }
}