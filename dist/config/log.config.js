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
var path = __importStar(require("path"));
// 日志根目录
var basePath = path.dirname(require.main.filename);
basePath = path.join(basePath, "log");
var baseLogPath = path.resolve(basePath);
// Debug日志目录
var debugPath = '/debug';
// 错误日志文件名
var debugFileName = 'debug';
// 错误日志输出完整路径
var debugLogPath = "" + baseLogPath + debugPath + "/" + debugFileName;
// 错误日志目录
var errorPath = '/error';
// 错误日志文件名
var errorFileName = 'error';
// 错误日志输出完整路径
var errorLogPath = "" + baseLogPath + errorPath + "/" + errorFileName;
// info日志目录
var infoPath = '/info';
// info日志文件名
var infoFileName = 'info';
// info日志输出完整路径
var infoLogPath = "" + baseLogPath + infoPath + "/" + infoFileName;
module.exports = {
    'appenders': {
        //日志配置
        'debug': {
            'type': 'console',
        },
        'error': {
            'type': 'dateFile',
            //输出位置
            'filename': errorLogPath,
            // 是否总是有后缀名
            'alwaysIncludePattern': true,
            // 后缀 每天创建一个新的日志文件
            'pattern': '-yyyy-MM-dd.log',
        },
        // info日志配置
        'info': {
            'type': 'dateFile',
            'filename': infoLogPath,
            'alwaysIncludePattern': true,
            'pattern': '-yyyy-MM-dd.log',
        }
    },
    // 设置logger名称以及对应的的日志等级
    'categories': {
        default: { appenders: ['debug'], level: 'debug' },
        erro: {
            'appenders': ['error'],
            'level': 'error'
        },
        info: {
            'appenders': ['info'],
            'level': 'info'
        },
    },
    'replaceConsole': true,
};
