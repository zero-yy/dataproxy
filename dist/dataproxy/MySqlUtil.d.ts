/// <reference types="node" />
export declare class MySqlUtil {
    constructor();
    responseDoReturn(res: any, result: any, resultJSON: any): void;
    query(sql: string): Promise<unknown>;
    selectOrInsert(array: string[], table: string, where: {
        [key: string]: string | number;
    }, insertInfo: {
        [key: string]: string | number;
    }, link?: 'AND' | 'OR'): Promise<unknown>;
    select(array: string[], table: string, where?: {
        [key: string]: string | number;
    }, link?: 'AND' | 'OR'): Promise<unknown>;
    insert(insertInfo: {
        [key: string]: string | number | Buffer;
    }, table: string): Promise<unknown>;
    update(info: {
        [key: string]: string | number | Buffer;
    }, table: string, where?: {
        [key: string]: string | number;
    }, link?: 'AND' | 'OR'): Promise<unknown>;
    delete(table: any, where: {
        [key: string]: string | number;
    }, link?: 'AND' | 'OR', info?: {
        [key: string]: string | number;
    }): Promise<unknown>;
    _operation(sql: any): Promise<unknown>;
    _handleWhereString(where: {
        [key: string]: string | number;
    }, link?: 'AND' | 'OR'): string;
    queryArgs(sql: any, args: any, callback: any): void;
}
declare let mySqlUtil: MySqlUtil;
export default mySqlUtil;
