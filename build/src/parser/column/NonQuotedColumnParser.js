"use strict";
exports.__esModule = true;
exports.NonQuotedColumnParser = void 0;
var ColumnFormatter_1 = require("./ColumnFormatter");
var Token_1 = require("../Token");
var NonQuotedColumnParser = /** @class */ (function () {
    function NonQuotedColumnParser(parserOptions) {
        this.parserOptions = parserOptions;
        this.columnFormatter = new ColumnFormatter_1.ColumnFormatter(parserOptions);
    }
    NonQuotedColumnParser.prototype.parse = function (scanner) {
        if (!scanner.hasMoreCharacters) {
            return null;
        }
        var parserOptions = this.parserOptions;
        var characters = [];
        var nextToken = scanner.nextCharacterToken;
        for (; nextToken; nextToken = scanner.nextCharacterToken) {
            if (Token_1.Token.isTokenDelimiter(nextToken, parserOptions) || Token_1.Token.isTokenRowDelimiter(nextToken)) {
                break;
            }
            characters.push(nextToken.token);
            scanner.advancePastToken(nextToken);
        }
        return this.columnFormatter.format(characters.join(''));
    };
    return NonQuotedColumnParser;
}());
exports.NonQuotedColumnParser = NonQuotedColumnParser;
