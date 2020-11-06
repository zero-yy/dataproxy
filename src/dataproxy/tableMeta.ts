// 表的元组信息，用于分析主键和副键
export default class TableMeta {
    // 表名
    name: string = "";
    // 主键
    primaryKey: string = "";
    // 聚合键
    aggregateKey: string = "";
}
