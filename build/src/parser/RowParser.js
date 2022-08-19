"use strict";
exports.__esModule = true;
exports.RowParser = void 0;
var column_1 = require("./column");
var Token_1 = require("./Token");
var EMPTY_STRING = '';
var RowParser = /** @class */ (function () {
    function RowParser(parserOptions) {
        this.parserOptions = parserOptions;
        this.columnParser = new column_1.ColumnParser(parserOptions);
    }
    RowParser.isEmptyRow = function (row) {
        return row.join(EMPTY_STRING).replace(/\s+/g, EMPTY_STRING) === EMPTY_STRING;
    };
    RowParser.prototype.parse = function (scanner) {
        var parserOptions = this.parserOptions;
        var hasMoreData = scanner.hasMoreData;
        var currentScanner = scanner;
        var columns = [];
        var currentToken = this.getStartToken(currentScanner, columns);
        while (currentToken) {
            if (Token_1.Token.isTokenRowDelimiter(currentToken)) {
                currentScanner.advancePastToken(currentToken);
                // if ends with CR and there is more data, keep unparsed due to possible
                // coming LF in CRLF
                if (!currentScanner.hasMoreCharacters &&
                    Token_1.Token.isTokenCarriageReturn(currentToken, parserOptions) &&
                    hasMoreData) {
                    return null;
                }
                currentScanner.truncateToCursor();
                return columns;
            }
            if (!this.shouldSkipColumnParse(currentScanner, currentToken, columns)) {
                var item = this.columnParser.parse(currentScanner);
                if (item === null) {
                    return null;
                }
                columns.push(item);
            }
            currentToken = currentScanner.nextNonSpaceToken;
        }
        if (!hasMoreData) {
            currentScanner.truncateToCursor();
            return columns;
        }
        return null;
    };
    RowParser.prototype.getStartToken = function (scanner, columns) {
        var currentToken = scanner.nextNonSpaceToken;
        if (currentToken !== null && Token_1.Token.isTokenDelimiter(currentToken, this.parserOptions)) {
            columns.push('');
            return scanner.nextNonSpaceToken;
        }
        return currentToken;
    };
    RowParser.prototype.shouldSkipColumnParse = function (scanner, currentToken, columns) {
        var parserOptions = this.parserOptions;
        if (Token_1.Token.isTokenDelimiter(currentToken, parserOptions)) {
            scanner.advancePastToken(currentToken);
            // if the delimiter is at the end of a line
            var nextToken = scanner.nextCharacterToken;
            if (!scanner.hasMoreCharacters || (nextToken !== null && Token_1.Token.isTokenRowDelimiter(nextToken))) {
                columns.push('');
                return true;
            }
            if (nextToken !== null && Token_1.Token.isTokenDelimiter(nextToken, parserOptions)) {
                columns.push('');
                return true;
            }
        }
        return false;
    };
    return RowParser;
}());
exports.RowParser = RowParser;
