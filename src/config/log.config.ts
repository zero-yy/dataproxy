import * as path from 'path';
// 日志根目录
let basePath = path.dirname((require.main as any).filename);
basePath = path.join(basePath, "log");
const baseLogPath = path.resolve(basePath);

// Debug日志目录
const debugPath = '/debug';
// 错误日志文件名
const debugFileName = 'debug';
// 错误日志输出完整路径
const debugLogPath = `${baseLogPath}${debugPath}/${debugFileName}`;

// 错误日志目录
const errorPath = '/error';
// 错误日志文件名
const errorFileName = 'error';
// 错误日志输出完整路径
const errorLogPath = `${baseLogPath}${errorPath}/${errorFileName}`;

// info日志目录
const infoPath = '/info';
// info日志文件名
const infoFileName = 'info';
// info日志输出完整路径
const infoLogPath = `${baseLogPath}${infoPath}/${infoFileName}`;

module.exports = {
    'appenders': {
        //日志配置
        'debug': {
            'type': 'console',
            //'type': 'dateFile',
            // 'filename': debugLogPath,
            // // 是否总是有后缀名
            // 'alwaysIncludePattern': true,
            // // 后缀 每天创建一个新的日志文件
            // 'pattern': '-yyyy-MM-dd.log',
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
