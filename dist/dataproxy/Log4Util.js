"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log4Util = void 0;
var log4js = __importStar(require("log4js"));
var logConfig = require('../config/log.config'); //引入数据库配置模块中的数据
// 加载配置文件
log4js.configure(logConfig);
var Log4Util = /** @class */ (function () {
    function Log4Util() {
    }
    Log4Util.prototype.debugLogger = function (debugMsg) {
        var logText = new String();
        logText += "\n" + "*************** 普通日志 ***************" + "\n";
        logText += debugMsg + "\n";
        logText += "***************************************" + "\n";
        log4js.getLogger('debug').debug(logText);
    };
    ;
    // 封装错误日志
    Log4Util.prototype.erroLogger = function (erroMsg) {
        var logText = new String();
        logText += "\n" + "*************** 错误日志 ***************" + "\n";
        logText += erroMsg + "\n";
        logText += "***************************************" + "\n";
        log4js.getLogger('erro').error(logText);
    };
    ;
    Log4Util.prototype.infoLogger = function (infoMsg) {
        var logText = new String();
        logText += "\n" + "*************** 重要日志 ***************" + "\n";
        logText += infoMsg + "\n";
        logText += "***************************************" + "\n";
        log4js.getLogger('info').info(logText);
    };
    ;
    return Log4Util;
}());
exports.Log4Util = Log4Util;
var log4Util = new Log4Util();
exports.default = log4Util;
