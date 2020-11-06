"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objToStrMap = exports.strMapToObj = void 0;
function strMapToObj(strMap) {
    var obj = Object.create(null);
    for (var _i = 0, strMap_1 = strMap; _i < strMap_1.length; _i++) {
        var _a = strMap_1[_i], k = _a[0], v = _a[1];
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
        console.log(k, v);
    }
    return obj;
}
exports.strMapToObj = strMapToObj;
function objToStrMap(obj) {
    var strMap = new Map();
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var k = _a[_i];
        strMap.set(k, obj[k]);
    }
    return strMap;
}
exports.objToStrMap = objToStrMap;
