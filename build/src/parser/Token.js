"use strict";
exports.__esModule = true;
exports.Token = void 0;
var Token = /** @class */ (function () {
    function Token(tokenArgs) {
        this.token = tokenArgs.token;
        this.startCursor = tokenArgs.startCursor;
        this.endCursor = tokenArgs.endCursor;
    }
    Token.isTokenRowDelimiter = function (token) {
        var content = token.token;
        return content === '\r' || content === '\n' || content === '\r\n';
    };
    Token.isTokenCarriageReturn = function (token, parserOptions) {
        return token.token === parserOptions.carriageReturn;
    };
    Token.isTokenComment = function (token, parserOptions) {
        return parserOptions.supportsComments && !!token && token.token === parserOptions.comment;
    };
    Token.isTokenEscapeCharacter = function (token, parserOptions) {
        return token.token === parserOptions.escapeChar;
    };
    Token.isTokenQuote = function (token, parserOptions) {
        return token.token === parserOptions.quote;
    };
    Token.isTokenDelimiter = function (token, parserOptions) {
        return token.token === parserOptions.delimiter;
    };
    return Token;
}());
exports.Token = Token;
