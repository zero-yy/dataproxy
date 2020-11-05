"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("start test dataproxy");
var dataproxy_1 = __importDefault(require("../dataproxy/dataproxy"));
dataproxy_1.default.select(["*"], "test", { "id": 18 }).then(function (result) {
    console.log(result);
});
