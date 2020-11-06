"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("start test dataproxy");
var dataProxy_1 = __importDefault(require("../dataProxy/dataProxy"));
var tableMetaMgr_1 = __importDefault(require("../dataProxy/tableMetaMgr"));
tableMetaMgr_1.default.mustLoadConfig("../../tableMetaConfig.json");
dataProxy_1.default.get("test", { "id": 18 });
// dataProxy.select(["*"], "test", {"id": 18}).then((result: any) => {
//     console.log(result)
// })
console.log("end test dataproxy");
