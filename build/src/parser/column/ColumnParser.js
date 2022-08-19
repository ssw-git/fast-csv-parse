"use strict";
exports.__esModule = true;
exports.ColumnParser = void 0;
var NonQuotedColumnParser_1 = require("./NonQuotedColumnParser");
var QuotedColumnParser_1 = require("./QuotedColumnParser");
var Token_1 = require("../Token");
var ColumnParser = /** @class */ (function () {
    function ColumnParser(parserOptions) {
        this.parserOptions = parserOptions;
        this.quotedColumnParser = new QuotedColumnParser_1.QuotedColumnParser(parserOptions);
        this.nonQuotedColumnParser = new NonQuotedColumnParser_1.NonQuotedColumnParser(parserOptions);
    }
    ColumnParser.prototype.parse = function (scanner) {
        var nextNonSpaceToken = scanner.nextNonSpaceToken;
        if (nextNonSpaceToken !== null && Token_1.Token.isTokenQuote(nextNonSpaceToken, this.parserOptions)) {
            scanner.advanceToToken(nextNonSpaceToken);
            return this.quotedColumnParser.parse(scanner);
        }
        return this.nonQuotedColumnParser.parse(scanner);
    };
    return ColumnParser;
}());
exports.ColumnParser = ColumnParser;
