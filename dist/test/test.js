"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("start test dataproxy");
var tableMetaMgr_1 = __importDefault(require("../dataProxy/tableMetaMgr"));
var tm = new tableMetaMgr_1.default();
tm.loadConfig("../../tableMetaConfig.json");
// dataProxy.select(["*"], "test", {"id": 18}).then((result: any) => {
//     console.log(result)
// })
console.log("end test dataproxy");
