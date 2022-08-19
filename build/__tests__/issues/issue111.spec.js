"use strict";
exports.__esModule = true;
var parser_1 = require("../../src/parser");
var ParserOptions_1 = require("../../src/ParserOptions");
describe('Issue #111 - https://github.com/C2FO/fast-csv/issues/111', function () {
    var createParser = function (parserOptions) {
        if (parserOptions === void 0) { parserOptions = {}; }
        return new parser_1.Parser(new ParserOptions_1.ParserOptions(parserOptions));
    };
    var runParser = function (data, hasMoreData, parser) { return parser.parse(data, hasMoreData); };
    it('should parse a block of CSV text with a trailing delimiter', function () {
        var data = 'first_name,last_name,email_address,empty\nFirst1,Last1,email1@email.com,\n';
        var myParser = createParser({ delimiter: ',' });
        expect(runParser(data, false, myParser)).toEqual({
            line: '',
            rows: [
                ['first_name', 'last_name', 'email_address', 'empty'],
                ['First1', 'Last1', 'email1@email.com', ''],
            ]
        });
    });
    it('should parse a block of CSV text with a delimiter at file end', function () {
        var data = 'first_name,last_name,email_address,empty\nFirst1,Last1,email1@email.com,';
        var myParser = createParser({ delimiter: ',' });
        expect(runParser(data, false, myParser)).toEqual({
            line: '',
            rows: [
                ['first_name', 'last_name', 'email_address', 'empty'],
                ['First1', 'Last1', 'email1@email.com', ''],
            ]
        });
    });
    it('should parse a block of CSV text with two delimiters at file end', function () {
        var data = 'first_name,last_name,email_address,empty1,empty2\nFirst1,Last1,email1@email.com,,';
        var myParser = createParser({ delimiter: ',' });
        expect(runParser(data, false, myParser)).toEqual({
            line: '',
            rows: [
                ['first_name', 'last_name', 'email_address', 'empty1', 'empty2'],
                ['First1', 'Last1', 'email1@email.com', '', ''],
            ]
        });
    });
    it('should parse a block of CSV text with a trailing delimiter followed by a space', function () {
        var data = 'first_name,last_name,email_address,empty\nFirst1,Last1,email1@email.com, \n';
        var myParser = createParser({ delimiter: ',' });
        expect(runParser(data, false, myParser)).toEqual({
            line: '',
            rows: [
                ['first_name', 'last_name', 'email_address', 'empty'],
                ['First1', 'Last1', 'email1@email.com', ' '],
            ]
        });
    });
    it('should parse a block of Space Separated Value text with a trailing delimiter', function () {
        var data = 'first_name last_name email_address empty\nFirst1 Last1 email1@email.com \n';
        var myParser = createParser({ delimiter: ' ' });
        expect(runParser(data, false, myParser)).toEqual({
            line: '',
            rows: [
                ['first_name', 'last_name', 'email_address', 'empty'],
                ['First1', 'Last1', 'email1@email.com', ''],
            ]
        });
    });
    it('should parse a block of Space Separated Values with two delimiters at file end', function () {
        var data = 'first_name last_name email_address empty empty2\nFirst1 Last1 email1@email.com  \n';
        var myParser = createParser({ delimiter: ' ' });
        expect(runParser(data, false, myParser)).toEqual({
            line: '',
            rows: [
                ['first_name', 'last_name', 'email_address', 'empty', 'empty2'],
                ['First1', 'Last1', 'email1@email.com', '', ''],
            ]
        });
    });
});
