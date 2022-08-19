"use strict";
exports.__esModule = true;
exports.QuotedColumnParser = void 0;
var ColumnFormatter_1 = require("./ColumnFormatter");
var Token_1 = require("../Token");
var QuotedColumnParser = /** @class */ (function () {
    function QuotedColumnParser(parserOptions) {
        this.parserOptions = parserOptions;
        this.columnFormatter = new ColumnFormatter_1.ColumnFormatter(parserOptions);
    }
    QuotedColumnParser.prototype.parse = function (scanner) {
        if (!scanner.hasMoreCharacters) {
            return null;
        }
        var originalCursor = scanner.cursor;
        var _a = this.gatherDataBetweenQuotes(scanner), foundClosingQuote = _a.foundClosingQuote, col = _a.col;
        if (!foundClosingQuote) {
            // reset the cursor to the original
            scanner.advanceTo(originalCursor);
            // if we didnt find a closing quote but we potentially have more data then skip the parsing
            // and return the original scanner.
            if (!scanner.hasMoreData) {
                throw new Error("Parse Error: missing closing: '".concat(this.parserOptions.quote || '', "' in line: at '").concat(scanner.lineFromCursor.replace(/[\r\n]/g, "\\n'"), "'"));
            }
            return null;
        }
        this.checkForMalformedColumn(scanner);
        return col;
    };
    QuotedColumnParser.prototype.gatherDataBetweenQuotes = function (scanner) {
        var parserOptions = this.parserOptions;
        var foundStartingQuote = false;
        var foundClosingQuote = false;
        var characters = [];
        var nextToken = scanner.nextCharacterToken;
        for (; !foundClosingQuote && nextToken !== null; nextToken = scanner.nextCharacterToken) {
            var isQuote = Token_1.Token.isTokenQuote(nextToken, parserOptions);
            // ignore first quote
            if (!foundStartingQuote && isQuote) {
                foundStartingQuote = true;
            }
            else if (foundStartingQuote) {
                if (Token_1.Token.isTokenEscapeCharacter(nextToken, parserOptions)) {
                    // advance past the escape character so we can get the next one in line
                    scanner.advancePastToken(nextToken);
                    var tokenFollowingEscape = scanner.nextCharacterToken;
                    // if the character following the escape is a quote character then just add
                    // the quote and advance to that character
                    if (tokenFollowingEscape !== null &&
                        (Token_1.Token.isTokenQuote(tokenFollowingEscape, parserOptions) ||
                            Token_1.Token.isTokenEscapeCharacter(tokenFollowingEscape, parserOptions))) {
                        characters.push(tokenFollowingEscape.token);
                        nextToken = tokenFollowingEscape;
                    }
                    else if (isQuote) {
                        // if the escape is also a quote then we found our closing quote and finish early
                        foundClosingQuote = true;
                    }
                    else {
                        // other wise add the escape token to the characters since it wast escaping anything
                        characters.push(nextToken.token);
                    }
                }
                else if (isQuote) {
                    // we found our closing quote!
                    foundClosingQuote = true;
                }
                else {
                    // add the token to the characters
                    characters.push(nextToken.token);
                }
            }
            scanner.advancePastToken(nextToken);
        }
        return { col: this.columnFormatter.format(characters.join('')), foundClosingQuote: foundClosingQuote };
    };
    QuotedColumnParser.prototype.checkForMalformedColumn = function (scanner) {
        var parserOptions = this.parserOptions;
        var nextNonSpaceToken = scanner.nextNonSpaceToken;
        if (nextNonSpaceToken) {
            var isNextTokenADelimiter = Token_1.Token.isTokenDelimiter(nextNonSpaceToken, parserOptions);
            var isNextTokenARowDelimiter = Token_1.Token.isTokenRowDelimiter(nextNonSpaceToken);
            if (!(isNextTokenADelimiter || isNextTokenARowDelimiter)) {
                // if the final quote was NOT followed by a column (,) or row(\n) delimiter then its a bad column
                // tldr: only part of the column was quoted
                var linePreview = scanner.lineFromCursor.substr(0, 10).replace(/[\r\n]/g, "\\n'");
                throw new Error("Parse Error: expected: '".concat(parserOptions.escapedDelimiter, "' OR new line got: '").concat(nextNonSpaceToken.token, "'. at '").concat(linePreview, "'"));
            }
            scanner.advanceToToken(nextNonSpaceToken);
        }
        else if (!scanner.hasMoreData) {
            scanner.advancePastLine();
        }
    };
    return QuotedColumnParser;
}());
exports.QuotedColumnParser = QuotedColumnParser;
