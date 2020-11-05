console.log("start test dataproxy")

import dataProxy from "../dataProxy/dataProxy";
import TabelMetaMgr from "../dataProxy/tableMetaMgr";

let tm = new TabelMetaMgr();
tm.loadConfig("../../tableMetaConfig.json")


// dataProxy.select(["*"], "test", {"id": 18}).then((result: any) => {
//     console.log(result)
// })

console.log("end test dataproxy")