"use strict";
exports.__esModule = true;
var src_1 = require("../../src");
var parser_1 = require("../../src/parser");
var createOptions = function (opts) {
    if (opts === void 0) { opts = {}; }
    return new src_1.ParserOptions(opts);
};
describe('Scanner', function () {
    var getScanner = function (line, hasMoreData, cursor, parserOpts) {
        if (cursor === void 0) { cursor = 0; }
        if (parserOpts === void 0) { parserOpts = {}; }
        return new parser_1.Scanner({
            line: line,
            parserOptions: createOptions(parserOpts),
            hasMoreData: hasMoreData,
            cursor: cursor
        });
    };
    var expectNonNullToken = function (token) {
        expect(token).not.toBeNull();
        return true;
    };
    var expectTokenContent = function (token, content) {
        if (expectNonNullToken(token)) {
            expect(token.token).toBe(content);
        }
    };
    describe('#hasMoreCharacters', function () {
        it('should return true if the cursor is not past the end of the line', function () {
            expect(getScanner('hello', true).hasMoreCharacters).toBe(true);
        });
        it('should return false if the cursor is not past the end of the line', function () {
            expect(getScanner('hello', true, 5).hasMoreCharacters).toBe(false);
        });
    });
    describe('#nextNonSpaceToken', function () {
        it('should get non space token in the line', function () {
            expectTokenContent(getScanner(' h', true, 0).nextNonSpaceToken, 'h');
        });
        it('should get the LF in the line', function () {
            expectTokenContent(getScanner(' \n', true, 0).nextNonSpaceToken, '\n');
        });
        it('should get the CR in the line', function () {
            expectTokenContent(getScanner(' \r', true, 0).nextNonSpaceToken, '\r');
        });
        it('should get the CRLF in the line', function () {
            expectTokenContent(getScanner(' \r\n', true, 0).nextNonSpaceToken, '\r\n');
        });
        it('should return null if there is nothing but white space', function () {
            expect(getScanner('    \t', true, 0).nextNonSpaceToken).toBeNull();
        });
        it('should return a token the delimiter is a space token', function () {
            expectTokenContent(getScanner('   \t', true, 0, { delimiter: '\t' }).nextNonSpaceToken, '\t');
        });
    });
    describe('#nextCharacterToken', function () {
        it('should get the next character in the line', function () {
            expectTokenContent(getScanner('h', true, 0).nextCharacterToken, 'h');
        });
        it('should get the next character in the line if it it whitespace', function () {
            expectTokenContent(getScanner(' h', true, 0).nextCharacterToken, ' ');
        });
        it('should return null if the cursor is at the end of the line', function () {
            expect(getScanner('hello', true, 5).nextCharacterToken).toBeNull();
        });
    });
    describe('#line from cursor', function () {
        it('should return the line from the current cursor', function () {
            expect(getScanner('hello', true, 2).lineFromCursor).toBe('llo');
        });
    });
    describe('#advancePastLine', function () {
        it('should advance past the next LF', function () {
            var scanner = getScanner('hel\nlo', true, 2);
            scanner.advancePastLine();
            expect(scanner.lineFromCursor).toBe('lo');
        });
        it('should advance past the next CR', function () {
            var scanner = getScanner('hel\rlo', true, 2);
            scanner.advancePastLine();
            expect(scanner.lineFromCursor).toBe('lo');
        });
        it('should advance past the next CRLF', function () {
            var scanner = getScanner('hel\r\nlo', true, 2);
            scanner.advancePastLine();
            expect(scanner.lineFromCursor).toBe('lo');
        });
    });
    describe('#advanceTo', function () {
        it('should set the cursor to the supplied value', function () {
            expect(getScanner('hello', true, 0).advanceTo(2).cursor).toBe(2);
        });
    });
    describe('#advanceToToken', function () {
        it('should set the cursor to the supplied value', function () {
            var scanner = getScanner('hello', true, 0);
            var token = scanner.nextCharacterToken;
            expectNonNullToken(token);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(scanner.advanceToToken(token).cursor).toBe(token.startCursor);
        });
    });
    describe('#advancePastToken', function () {
        it('should set the cursor to the supplied value', function () {
            var scanner = getScanner('hello', true, 0);
            var token = scanner.nextCharacterToken;
            expectNonNullToken(token);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(scanner.advancePastToken(token).cursor).toBe(token.endCursor + 1);
        });
    });
    describe('#truncateToCursor', function () {
        it('should set the cursor to the supplied value', function () {
            var scanner = getScanner('hello', true, 2).truncateToCursor();
            expect(scanner.line).toBe('llo');
            expect(scanner.lineLength).toBe(3);
            expect(scanner.cursor).toBe(0);
        });
    });
});
describe('Token', function () {
    var createToken = function (token) { return new parser_1.Token({ token: token, startCursor: 0, endCursor: 1 }); };
    describe('.isTokenRowDelimiter', function () {
        it('should return true if the token is a row delimiter', function () {
            expect(parser_1.Token.isTokenRowDelimiter(createToken('\n'))).toBe(true);
            expect(parser_1.Token.isTokenRowDelimiter(createToken('\r'))).toBe(true);
            expect(parser_1.Token.isTokenRowDelimiter(createToken('\r\n'))).toBe(true);
        });
        it('should return false if the token is not a row delimiter', function () {
            expect(parser_1.Token.isTokenRowDelimiter(createToken('\\n'))).toBe(false);
            expect(parser_1.Token.isTokenRowDelimiter(createToken('\\r'))).toBe(false);
        });
    });
    describe('#isTokenCarriageReturn', function () {
        it('should return true if the token is a CR delimiter', function () {
            expect(parser_1.Token.isTokenCarriageReturn(createToken('\r'), createOptions())).toBe(true);
        });
        it('should return false if the token is not a CR delimiter', function () {
            expect(parser_1.Token.isTokenCarriageReturn(createToken('\n'), createOptions())).toBe(false);
            expect(parser_1.Token.isTokenCarriageReturn(createToken('\r\n'), createOptions())).toBe(false);
        });
    });
    describe('#isTokenComment', function () {
        it('should return true if the token is a comment character', function () {
            expect(parser_1.Token.isTokenComment(createToken('#'), createOptions({ comment: '#' }))).toBe(true);
        });
        it('should return false if the token is not a comment character', function () {
            expect(parser_1.Token.isTokenComment(createToken('+'), createOptions({ comment: '#' }))).toBe(false);
        });
        it('should return false if the token is not a comments are not supported', function () {
            expect(parser_1.Token.isTokenComment(createToken('#'), createOptions())).toBe(false);
        });
    });
    describe('#isTokenEscapeCharacter', function () {
        it('should return true if the token is an escape character', function () {
            expect(parser_1.Token.isTokenEscapeCharacter(createToken('\\'), createOptions({ escape: '\\' }))).toBe(true);
        });
        it('should return false if the token is not a escape character', function () {
            expect(parser_1.Token.isTokenEscapeCharacter(createToken('"'), createOptions({ escape: '\\' }))).toBe(false);
        });
    });
    describe('#isTokenQuote', function () {
        it('should return true if the token is an quote character', function () {
            expect(parser_1.Token.isTokenEscapeCharacter(createToken('$'), createOptions({ quote: '$' }))).toBe(true);
        });
        it('should return false if the token is not a quote character', function () {
            expect(parser_1.Token.isTokenEscapeCharacter(createToken('"'), createOptions({ quote: '$' }))).toBe(false);
        });
    });
    describe('#isTokenDelimiter', function () {
        it('should return true if the token is an delimiter character', function () {
            expect(parser_1.Token.isTokenDelimiter(createToken('\t'), createOptions({ delimiter: '\t' }))).toBe(true);
        });
        it('should return false if the token is not a delimiter character', function () {
            expect(parser_1.Token.isTokenDelimiter(createToken(','), createOptions({ delimiter: '\t' }))).toBe(false);
        });
    });
});
