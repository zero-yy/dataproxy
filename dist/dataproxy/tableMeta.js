"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 表的元组信息，用于分析主键和副键
var TabelMeta = /** @class */ (function () {
    function TabelMeta() {
        // 表名
        this.name = "";
        // 主键
        this.primaryKey = "";
        // 聚合键
        this.aggregateKey = "";
    }
    return TabelMeta;
}());
exports.default = TabelMeta;
