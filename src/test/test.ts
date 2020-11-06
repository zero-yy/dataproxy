console.log("start test dataproxy")

import dataProxy from "../dataProxy/dataProxy";
import tableMetaMgr from "../dataProxy/tableMetaMgr";

tableMetaMgr.mustLoadConfig("../../tableMetaConfig.json")

dataProxy.get("test", {"id": 18})

// dataProxy.select(["*"], "test", {"id": 18}).then((result: any) => {
//     console.log(result)
// })

console.log("end test dataproxy")