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
exports.write = void 0;
var fs_1 = require("fs");
var path = require("path");
__exportStar(require("./alternateEncoding"), exports);
__exportStar(require("./noHeadersAndQuotes"), exports);
__exportStar(require("./skipLines"), exports);
__exportStar(require("./withHeaders"), exports);
__exportStar(require("./withHeadersAndQuotes"), exports);
__exportStar(require("./withHeadersAndAlternateQuote"), exports);
__exportStar(require("./withHeadersAndMissingColumns"), exports);
__exportStar(require("./withHeadersAlternateDelimiter"), exports);
__exportStar(require("./withHeadersAndSkippedLines"), exports);
__exportStar(require("./headerColumnMismatch"), exports);
__exportStar(require("./malformed"), exports);
__exportStar(require("./trailingComma"), exports);
__exportStar(require("./emptyRows"), exports);
__exportStar(require("./duplicateHeaders"), exports);
__exportStar(require("./RecordingStream"), exports);
__exportStar(require("./helpers"), exports);
var mkDirIfNotExists = function (filePath) {
    var dir = path.dirname(filePath);
    if (!(0, fs_1.existsSync)(dir)) {
        (0, fs_1.mkdirSync)(dir);
    }
};
var write = function (opts) {
    mkDirIfNotExists(opts.path);
    (0, fs_1.writeFileSync)(opts.path, opts.content);
};
exports.write = write;
