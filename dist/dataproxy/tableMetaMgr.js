"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabelMetaMgr = void 0;
var tableMeta_1 = __importDefault(require("./tableMeta"));
var TabelMetaMgr = /** @class */ (function () {
    function TabelMetaMgr() {
        this.mDataConfig = new Map();
    }
    TabelMetaMgr.prototype.hasMeta = function (name) {
        return this.mDataConfig.has(name);
    };
    TabelMetaMgr.prototype.getMeta = function (name) {
        return this.mDataConfig.get(name);
    };
    TabelMetaMgr.prototype.getConfig = function () {
        return this.mDataConfig;
    };
    // 失败时，直接抛出异常
    TabelMetaMgr.prototype.mustLoadConfig = function (configFileName) {
        var metas = require(configFileName);
        // console.log(metas)
        // 需要传递this进去
        metas.forEach(function (meta) {
            var m = new tableMeta_1.default();
            m.name = meta.name;
            m.primaryKey = meta.primaryKey;
            m.aggregateKey = meta.aggregateKey;
            if (m.name == undefined || m.primaryKey == undefined || m.aggregateKey == undefined) {
                throw new Error("table meta config err: " + JSON.stringify(m));
            }
            if (m.name == null || m.primaryKey == null) {
                throw new Error("meta config err");
            }
            //todo 连接数据库，检查表和主键等信息是否正确
            this.mDataConfig.set(m.name, m);
        }, this);
        // map打印有点特殊
        console.log("TableMetaMgr loaded config:\n ");
        console.log(this.mDataConfig);
    };
    return TabelMetaMgr;
}());
exports.TabelMetaMgr = TabelMetaMgr;
// singleton
var tableMetaMgr = new TabelMetaMgr();
exports.default = tableMetaMgr;
