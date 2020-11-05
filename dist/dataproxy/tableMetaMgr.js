"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = require("process");
var tableMeta_1 = __importDefault(require("./tableMeta"));
var TabelMetaMgr = /** @class */ (function () {
    function TabelMetaMgr() {
        this.mDataConfig = new Map();
    }
    TabelMetaMgr.prototype.loadConfig = function (configFileName) {
        var metas = require(configFileName);
        // console.log(metas)
        // 需要传递this进去
        metas.forEach(function (meta) {
            var m = new tableMeta_1.default();
            m.name = meta.name;
            m.primaryKey = meta.primaryKey;
            m.aggregateKey = meta.aggregateKey;
            if (m.name == undefined || m.primaryKey == undefined || m.aggregateKey == undefined) {
                console.error("table meta config err: " + JSON.stringify(m));
                process_1.exit(0);
            }
            if (m.name == null || m.primaryKey == null) {
                console.error("meta config err");
                process_1.exit(0);
            }
            //todo 连接数据库，检查表和主键等信息是否正确
            this.mDataConfig[m.name] = m;
        }, this);
        console.log(this.mDataConfig);
    };
    return TabelMetaMgr;
}());
exports.default = TabelMetaMgr;
