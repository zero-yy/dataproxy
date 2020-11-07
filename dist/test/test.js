"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('start test dataproxy');
var dataProxy_1 = __importDefault(require("../dataProxy/dataProxy"));
var tableMetaMgr_1 = __importDefault(require("../dataProxy/tableMetaMgr"));
tableMetaMgr_1.default.mustLoadConfig('../../tableMetaConfig.json');
// dataProxy.get("test", {"id": 18})
// dataProxy.get("test2", {"id": 1, "userId": 1})
// dataProxy.get("test2", {"id": 2, "userId": 1})
dataProxy_1.default
    .getOne('test', 1812)
    .then(function (result) {
    console.log('log outside');
    console.log(result);
})
    .catch(function (err) {
    console.log('catch outside');
    console.log(typeof err);
    console.log(err);
});
// dataProxy.select(["*"], "test", {"id": 18}).then((result: any) => {
//     console.log(result)
// })
console.log('end test dataproxy');
