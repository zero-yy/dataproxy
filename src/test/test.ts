console.log("start test dataproxy")

import dataProxy from "../dataproxy/dataproxy";
dataProxy.select(["*"], "test", {"id": 18}).then((result: any) => {
    console.log(result)
})