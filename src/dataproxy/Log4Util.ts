import * as log4js from 'log4js';
var logConfig = require('../config/log.config');  //引入数据库配置模块中的数据

// 加载配置文件
log4js.configure(logConfig);

export class Log4Util {

    public debugLogger(debugMsg: string) {
        let logText = new String();
        logText += "\n" + "*************** 普通日志 ***************" + "\n";
        logText += debugMsg + "\n";
        logText += "***************************************" + "\n";
        log4js.getLogger('debug').debug(logText);
    };

    // 封装错误日志
    public erroLogger(erroMsg: string) {
        let logText = new String();
        logText += "\n" + "*************** 错误日志 ***************" + "\n";
        logText += erroMsg + "\n";
        logText += "***************************************" + "\n";
        log4js.getLogger('erro').error(logText);
    };

    public infoLogger(infoMsg: string) {
        let logText = new String();
        logText += "\n" + "*************** 重要日志 ***************" + "\n";
        logText += infoMsg + "\n";
        logText += "***************************************" + "\n";
        log4js.getLogger('info').info(logText);
    };

    // // 封装info日志
    // public loginfo(ctx, resTime) {
    //     if (ctx) {
    //         infoLogger.info(this.formatRes(ctx, resTime));
    //     }
    // };

    // // 格式化info日志
    // formatRes(ctx, resTime) {
    //     let logText = new String();

    //     // info日志开始
    //     logText += "\n" + "*************** info log start ***************" + "\n";

    //     // 添加请求日志
    //     logText += this.formatReqLog(ctx.request, resTime).toString();

    //     // info状态码
    //     logText += "info status: " + ctx.status + "\n";

    //     // info内容
    //     logText += "info body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //     // info日志结束
    //     logText += "*************** info log end ***************" + "\n";

    //     return logText;
    // };
}
let log4Util = new Log4Util()
export default log4Util;