"use strict";
exports.__esModule = true;
exports.Parser = void 0;
var Scanner_1 = require("./Scanner");
var RowParser_1 = require("./RowParser");
var Token_1 = require("./Token");
var Parser = /** @class */ (function () {
    function Parser(parserOptions) {
        this.parserOptions = parserOptions;
        this.rowParser = new RowParser_1.RowParser(this.parserOptions);
    }
    Parser.removeBOM = function (line) {
        // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
        // conversion translates it to FEFF (UTF-16 BOM)
        if (line && line.charCodeAt(0) === 0xfeff) {
            return line.slice(1);
        }
        return line;
    };
    Parser.prototype.parse = function (line, hasMoreData) {
        var scanner = new Scanner_1.Scanner({
            line: Parser.removeBOM(line),
            parserOptions: this.parserOptions,
            hasMoreData: hasMoreData
        });
        if (this.parserOptions.supportsComments) {
            return this.parseWithComments(scanner);
        }
        return this.parseWithoutComments(scanner);
    };
    Parser.prototype.parseWithoutComments = function (scanner) {
        var rows = [];
        var shouldContinue = true;
        while (shouldContinue) {
            shouldContinue = this.parseRow(scanner, rows);
        }
        return { line: scanner.line, rows: rows };
    };
    Parser.prototype.parseWithComments = function (scanner) {
        var parserOptions = this.parserOptions;
        var rows = [];
        for (var nextToken = scanner.nextCharacterToken; nextToken !== null; nextToken = scanner.nextCharacterToken) {
            if (Token_1.Token.isTokenComment(nextToken, parserOptions)) {
                var cursor = scanner.advancePastLine();
                if (cursor === null) {
                    return { line: scanner.lineFromCursor, rows: rows };
                }
                if (!scanner.hasMoreCharacters) {
                    return { line: scanner.lineFromCursor, rows: rows };
                }
                scanner.truncateToCursor();
            }
            else if (!this.parseRow(scanner, rows)) {
                break;
            }
        }
        return { line: scanner.line, rows: rows };
    };
    Parser.prototype.parseRow = function (scanner, rows) {
        var nextToken = scanner.nextNonSpaceToken;
        if (!nextToken) {
            return false;
        }
        var row = this.rowParser.parse(scanner);
        if (row === null) {
            return false;
        }
        if (this.parserOptions.ignoreEmpty && RowParser_1.RowParser.isEmptyRow(row)) {
            return true;
        }
        rows.push(row);
        return true;
    };
    return Parser;
}());
exports.Parser = Parser;
