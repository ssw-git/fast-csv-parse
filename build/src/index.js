"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.parseString = exports.parseFile = exports.parseStream = exports.parse = exports.ParserOptions = exports.CsvParserStream = void 0;
var fs = require("fs");
var stream_1 = require("stream");
var ParserOptions_1 = require("./ParserOptions");
var CsvParserStream_1 = require("./CsvParserStream");
__exportStar(require("./types"), exports);
var CsvParserStream_2 = require("./CsvParserStream");
__createBinding(exports, CsvParserStream_2, "CsvParserStream");
var ParserOptions_2 = require("./ParserOptions");
__createBinding(exports, ParserOptions_2, "ParserOptions");
var parse = function (args) {
    return new CsvParserStream_1.CsvParserStream(new ParserOptions_1.ParserOptions(args));
};
exports.parse = parse;
var parseStream = function (stream, options) { return stream.pipe(new CsvParserStream_1.CsvParserStream(new ParserOptions_1.ParserOptions(options))); };
exports.parseStream = parseStream;
var parseFile = function (location, options) {
    if (options === void 0) { options = {}; }
    return fs.createReadStream(location).pipe(new CsvParserStream_1.CsvParserStream(new ParserOptions_1.ParserOptions(options)));
};
exports.parseFile = parseFile;
var parseString = function (string, options) {
    var rs = new stream_1.Readable();
    rs.push(string);
    rs.push(null);
    return rs.pipe(new CsvParserStream_1.CsvParserStream(new ParserOptions_1.ParserOptions(options)));
};
exports.parseString = parseString;
