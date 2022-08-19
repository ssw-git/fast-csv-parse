"use strict";
exports.__esModule = true;
exports.Scanner = void 0;
var Token_1 = require("./Token");
var ROW_DELIMITER = /((?:\r\n)|\n|\r)/;
var Scanner = /** @class */ (function () {
    function Scanner(args) {
        this.cursor = 0;
        this.line = args.line;
        this.lineLength = this.line.length;
        this.parserOptions = args.parserOptions;
        this.hasMoreData = args.hasMoreData;
        this.cursor = args.cursor || 0;
    }
    Object.defineProperty(Scanner.prototype, "hasMoreCharacters", {
        get: function () {
            return this.lineLength > this.cursor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scanner.prototype, "nextNonSpaceToken", {
        get: function () {
            var lineFromCursor = this.lineFromCursor;
            var regex = this.parserOptions.NEXT_TOKEN_REGEXP;
            if (lineFromCursor.search(regex) === -1) {
                return null;
            }
            var match = regex.exec(lineFromCursor);
            if (match == null) {
                return null;
            }
            var token = match[1];
            var startCursor = this.cursor + (match.index || 0);
            return new Token_1.Token({
                token: token,
                startCursor: startCursor,
                endCursor: startCursor + token.length - 1
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scanner.prototype, "nextCharacterToken", {
        get: function () {
            var _a = this, cursor = _a.cursor, lineLength = _a.lineLength;
            if (lineLength <= cursor) {
                return null;
            }
            return new Token_1.Token({
                token: this.line[cursor],
                startCursor: cursor,
                endCursor: cursor
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scanner.prototype, "lineFromCursor", {
        get: function () {
            return this.line.substr(this.cursor);
        },
        enumerable: false,
        configurable: true
    });
    Scanner.prototype.advancePastLine = function () {
        var match = ROW_DELIMITER.exec(this.lineFromCursor);
        if (!match) {
            if (this.hasMoreData) {
                return null;
            }
            this.cursor = this.lineLength;
            return this;
        }
        this.cursor += (match.index || 0) + match[0].length;
        return this;
    };
    Scanner.prototype.advanceTo = function (cursor) {
        this.cursor = cursor;
        return this;
    };
    Scanner.prototype.advanceToToken = function (token) {
        this.cursor = token.startCursor;
        return this;
    };
    Scanner.prototype.advancePastToken = function (token) {
        this.cursor = token.endCursor + 1;
        return this;
    };
    Scanner.prototype.truncateToCursor = function () {
        this.line = this.lineFromCursor;
        this.lineLength = this.line.length;
        this.cursor = 0;
        return this;
    };
    return Scanner;
}());
exports.Scanner = Scanner;
