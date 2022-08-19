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
exports.__esModule = true;
exports.QuotedColumnParser = exports.NonQuotedColumnParser = exports.ColumnParser = exports.Token = exports.Scanner = exports.RowParser = exports.Parser = void 0;
var Parser_1 = require("./Parser");
__createBinding(exports, Parser_1, "Parser");
var RowParser_1 = require("./RowParser");
__createBinding(exports, RowParser_1, "RowParser");
var Scanner_1 = require("./Scanner");
__createBinding(exports, Scanner_1, "Scanner");
var Token_1 = require("./Token");
__createBinding(exports, Token_1, "Token");
var column_1 = require("./column");
__createBinding(exports, column_1, "ColumnParser");
__createBinding(exports, column_1, "NonQuotedColumnParser");
__createBinding(exports, column_1, "QuotedColumnParser");
