import TabelMetaMgr from './tableMetaMgr';
export declare class DataProxy {
    mTableMetaMgr: TabelMetaMgr;
    constructor();
    select(array: string[], table: string, where?: {
        [key: string]: string | number;
    }, link?: 'AND' | 'OR'): Promise<unknown>;
    _operation(sql: any): Promise<unknown>;
    _handleWhereString(where: {
        [key: string]: string | number;
    }, link?: 'AND' | 'OR'): string;
}
declare let dataProxy: DataProxy;
export default dataProxy;
