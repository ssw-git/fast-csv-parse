"use strict";
exports.__esModule = true;
var src_1 = require("../../src");
var parser_1 = require("../../src/parser");
describe('Parser', function () {
    var createParser = function (parserOptions) {
        if (parserOptions === void 0) { parserOptions = {}; }
        return new parser_1.Parser(new src_1.ParserOptions(parserOptions));
    };
    var parse = function (data, hasMoreData, parser) { return parser.parse(data, hasMoreData); };
    it('should parse a block of CSV text that starts with a BOM', function () {
        var data = '\ufefffirst_name,last_name,email_address';
        var myParser = createParser({ delimiter: ',' });
        expect(parse(data, false, myParser)).toEqual({
            line: '',
            rows: [['first_name', 'last_name', 'email_address']]
        });
    });
    describe('with \\n', function () {
        describe('unescaped data', function () {
            it('should parse a block of CSV text', function () {
                var data = 'first_name,last_name,email_address\nFirst1,Last1,email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First1', 'Last1', 'email1@email.com'],
                    ]
                });
            });
            it('should ignore empty rows if ignoreEmpty is true', function () {
                var data = 'first_name,last_name,email_address\nFirst1,Last1,email1@email.com\n,,';
                var myParser = createParser({ delimiter: ',', ignoreEmpty: true });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First1', 'Last1', 'email1@email.com'],
                    ]
                });
            });
            it('should not ignore empty rows if ignoreEmpty is false', function () {
                var data = 'first_name,last_name,email_address\nFirst1,Last1,email1@email.com\n,,';
                var myParser = createParser({ delimiter: ',', ignoreEmpty: false });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First1', 'Last1', 'email1@email.com'],
                        ['', '', ''],
                    ]
                });
            });
            it('should parse a block of CSV text with a trailing delimiter', function () {
                var data = 'first_name,last_name,email_address,empty\nFirst1,Last1,email1@email.com,\n';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address', 'empty'],
                        ['First1', 'Last1', 'email1@email.com', ''],
                    ]
                });
            });
            it('should parse a block of CSV text with a trailing delimiter and no new line', function () {
                var data = 'first_name,last_name,email_address,empty\nFirst1,Last1,email1@email.com,';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address', 'empty'],
                        ['First1', 'Last1', 'email1@email.com', ''],
                    ]
                });
            });
            it('should parse a block of CSV text with a trailing delimiter followed by a space', function () {
                var data = 'first_name,last_name,email_address,empty\nFirst1,Last1,email1@email.com, \n';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
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
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address', 'empty'],
                        ['First1', 'Last1', 'email1@email.com', ''],
                    ]
                });
            });
            it('should return the rest of the line if there is more data', function () {
                var data = 'first_name,last_name,email_address\nFirst1,Last1,email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, true, myParser)).toEqual({
                    line: 'First1,Last1,email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
            });
            it('should accept new data and return the result', function () {
                var data = 'first_name,last_name,email_address\nFirst1,Last1,email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'First1,Last1,email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
                expect(parse("".concat(parsedData.line, "\nFirst2,Last2,email2@email.com"), false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['First1', 'Last1', 'email1@email.com'],
                        ['First2', 'Last2', 'email2@email.com'],
                    ]
                });
            });
            it('should not parse a row if a new line is not found and there is more data', function () {
                var data = 'first_name,last_name,email_address';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'first_name,last_name,email_address',
                    rows: []
                });
            });
            it('should not parse a row if there is a trailing delimiter and there is more data', function () {
                var data = 'first_name,last_name,email_address,';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'first_name,last_name,email_address,',
                    rows: []
                });
            });
            it('should not parse a row if there is a trailing delimiter with a space, and there is more data', function () {
                var data = 'first_name,last_name,email_address, ';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'first_name,last_name,email_address, ',
                    rows: []
                });
            });
            it('should parse a row if a new line is found and there is more data', function () {
                var data = 'first_name,last_name,email_address\n';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
            });
        });
        describe('escaped values', function () {
            it('should parse a block of CSV text', function () {
                var data = 'first_name,last_name,email_address\n"First,1","Last,1","email1@email.com"';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First,1', 'Last,1', 'email1@email.com'],
                    ]
                });
            });
            it('should parse a block of CSV text with a trailing delimiter', function () {
                var data = 'first_name,last_name,email_address,empty\nFirst1,Last1,email1@email.com,\n';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address', 'empty'],
                        ['First1', 'Last1', 'email1@email.com', ''],
                    ]
                });
            });
            it('should parse a block of CSV text with a trailing delimiter followed by a space', function () {
                var data = 'first_name,last_name,email_address,empty\nFirst1,Last1,email1@email.com, \n';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
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
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address', 'empty'],
                        ['First1', 'Last1', 'email1@email.com', ''],
                    ]
                });
            });
            it('should parse a block of CSV text with escaped escaped char', function () {
                var data = 'first_name,last_name,email_address\n"First,""1""","Last,""1""","email1@email.com"';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First,"1"', 'Last,"1"', 'email1@email.com'],
                    ]
                });
            });
            it('should parse a block of CSV text with alternate escape char', function () {
                var data = 'first_name,last_name,email_address\n"First,\\"1\\"","Last,\\"1\\"","email1@email.com"';
                var myParser = createParser({ delimiter: ',', escape: '\\' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First,"1"', 'Last,"1"', 'email1@email.com'],
                    ]
                });
            });
            it('should return the rest of the line if a complete value is not found', function () {
                var data = 'first_name,last_name,email_address\n"First,""1""","Last,""1""","email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, true, myParser)).toEqual({
                    line: '"First,""1""","Last,""1""","email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
            });
            it('should accept more data appended to the returned line with escaped values', function () {
                var data = 'first_name,last_name,email_address\n"First,""1""","Last,""1""","email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"First,""1""","Last,""1""","email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
                expect(parse("".concat(parsedData.line, "\"\n\"First,\"\"2\"\"\",\"Last,\"\"2\"\"\",\"email2@email.com\""), false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['First,"1"', 'Last,"1"', 'email1@email.com'],
                        ['First,"2"', 'Last,"2"', 'email2@email.com'],
                    ]
                });
            });
            it('should throw an error if there is not more data and there is an invalid escape sequence', function () {
                var data = 'first_name,last_name,email_address\n"First,""1""","Last,""1""","email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"First,""1""","Last,""1""","email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
                expect(function () {
                    myParser.parse("".concat(parsedData.line, "\n\"First,\"\",2\"\"\",\"Last\"\"2\"\"\",\"email2@email.com\""), false);
                }).toThrow(/Parse Error: expected: ',' OR new line got: 'F'. at 'First,"",2/);
            });
            it('should handle empty values properly', function () {
                var data = '"","",""\n,Last4,email4@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, false, myParser);
                expect(parsedData).toEqual({
                    line: '',
                    rows: [
                        ['', '', ''],
                        ['', 'Last4', 'email4@email.com'],
                    ]
                });
            });
            it('should not parse a row if a new line is not found and there is more data', function () {
                var data = '"first_name","last_name","email_address"';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"first_name","last_name","email_address"',
                    rows: []
                });
            });
            it('should not parse a row if there is a trailing delimiter and there is more data', function () {
                var data = '"first_name","last_name","email_address",';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"first_name","last_name","email_address",',
                    rows: []
                });
            });
            it('should parse a row if a new line is found and there is more data', function () {
                var data = '"first_name","last_name","email_address"\n';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
            });
        });
        describe('null quote', function () {
            it('should ignore escaping if quote is null', function () {
                var data = 'first_name,last_name,email_address\n"First1","Last1","email1@email.com"';
                var myParser = createParser({ delimiter: ',', quote: null });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['"First1"', '"Last1"', '"email1@email.com"'],
                    ]
                });
            });
        });
    });
    describe('with \\r', function () {
        describe('unescaped data', function () {
            it('should parse a block of CSV text', function () {
                var data = 'first_name,last_name,email_address\rFirst1,Last1,email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First1', 'Last1', 'email1@email.com'],
                    ]
                });
            });
            it('should parse a block of CSV text with a trailing delimiter', function () {
                var data = 'first_name,last_name,email_address,empty\rFirst1,Last1,email1@email.com,\r';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address', 'empty'],
                        ['First1', 'Last1', 'email1@email.com', ''],
                    ]
                });
            });
            it('should parse a block of CSV text with a trailing delimiter followed by a space', function () {
                var data = 'first_name,last_name,email_address,empty\nFirst1,Last1,email1@email.com, \r';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address', 'empty'],
                        ['First1', 'Last1', 'email1@email.com', ' '],
                    ]
                });
            });
            it('should parse a block of Space Separated Value text with a trailing delimiter', function () {
                var data = 'first_name last_name email_address empty\rFirst1 Last1 email1@email.com \r';
                var myParser = createParser({ delimiter: ' ' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address', 'empty'],
                        ['First1', 'Last1', 'email1@email.com', ''],
                    ]
                });
            });
            it('should return the rest of the line if there is more data', function () {
                var data = 'first_name,last_name,email_address\rFirst1,Last1,email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, true, myParser)).toEqual({
                    line: 'First1,Last1,email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
            });
            it('should accept new data and return the result', function () {
                var data = 'first_name,last_name,email_address\rFirst1,Last1,email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'First1,Last1,email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
                expect(parse("".concat(parsedData.line, "\rFirst2,Last2,email2@email.com"), false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['First1', 'Last1', 'email1@email.com'],
                        ['First2', 'Last2', 'email2@email.com'],
                    ]
                });
            });
            it('should not parse a row if a new line is not found and there is more data', function () {
                var data = 'first_name,last_name,email_address';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'first_name,last_name,email_address',
                    rows: []
                });
            });
            it('should not parse a row if there is a trailing delimiter and there is more data', function () {
                var data = 'first_name,last_name,email_address,';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'first_name,last_name,email_address,',
                    rows: []
                });
            });
            it('should not parse a row if an ambiguous new line is found and there is more data', function () {
                var data = 'first_name,last_name,email_address\r';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'first_name,last_name,email_address\r',
                    rows: []
                });
            });
        });
        describe('escaped values', function () {
            it('should parse a block of CSV text', function () {
                var data = 'first_name,last_name,email_address\r"First,1","Last,1","email1@email.com"';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First,1', 'Last,1', 'email1@email.com'],
                    ]
                });
            });
            it('should parse a block of CSV text with escaped escaped char', function () {
                var data = 'first_name,last_name,email_address\r"First,""1""","Last,""1""","email1@email.com"';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First,"1"', 'Last,"1"', 'email1@email.com'],
                    ]
                });
            });
            it('should parse a block of CSV text with alternate escape char', function () {
                var data = 'first_name,last_name,email_address\r"First,\\"1\\"","Last,\\"1\\"","email1@email.com"';
                var myParser = createParser({ delimiter: ',', escape: '\\' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First,"1"', 'Last,"1"', 'email1@email.com'],
                    ]
                });
            });
            it('should return the rest of the line if a complete value is not found', function () {
                var data = 'first_name,last_name,email_address\r"First,""1""","Last,""1""","email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, true, myParser)).toEqual({
                    line: '"First,""1""","Last,""1""","email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
            });
            it('should accept more data appended to the returned line with escaped values', function () {
                var data = 'first_name,last_name,email_address\r"First,""1""","Last,""1""","email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"First,""1""","Last,""1""","email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
                expect(parse("".concat(parsedData.line, "\"\r\"First,\"\"2\"\"\",\"Last,\"\"2\"\"\",\"email2@email.com\""), false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['First,"1"', 'Last,"1"', 'email1@email.com'],
                        ['First,"2"', 'Last,"2"', 'email2@email.com'],
                    ]
                });
            });
            it('should throw an error if there is not more data and there is an invalid escape sequence', function () {
                var data = 'first_name,last_name,email_address\r"First,""1""","Last,""1""","email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"First,""1""","Last,""1""","email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
                expect(function () {
                    myParser.parse("".concat(parsedData.line, "\r\"First,\"\",2\"\"\",\"Last\"\"2\"\"\",\"email2@email.com\""), false);
                }).toThrow(/Parse Error: expected: ',' OR new line got: 'F'. at 'First,"",2/);
            });
            it('should handle empty values properly', function () {
                var data = '"","",""\r,Last4,email4@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, false, myParser);
                expect(parsedData).toEqual({
                    line: '',
                    rows: [
                        ['', '', ''],
                        ['', 'Last4', 'email4@email.com'],
                    ]
                });
            });
            it('should not parse a row if a new line is not found and there is more data', function () {
                var data = '"first_name","last_name","email_address"';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"first_name","last_name","email_address"',
                    rows: []
                });
            });
            it('should not parse a row if there is a trailing delimiter and there is more data', function () {
                var data = '"first_name","last_name","email_address",';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"first_name","last_name","email_address",',
                    rows: []
                });
            });
            it('should not parse a row if an ambiguous new line is found and there is more data', function () {
                var data = '"first_name","last_name","email_address"\r';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"first_name","last_name","email_address"\r',
                    rows: []
                });
            });
        });
        describe('null quote', function () {
            it('should ignore escaping if quote is null', function () {
                var data = 'first_name,last_name,email_address\r"First1","Last1","email1@email.com"';
                var myParser = createParser({ delimiter: ',', quote: null });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['"First1"', '"Last1"', '"email1@email.com"'],
                    ]
                });
            });
        });
    });
    describe('with \\r\\n', function () {
        describe('unescaped data', function () {
            it('should parse a block of CSV text', function () {
                var data = 'first_name,last_name,email_address\r\nFirst1,Last1,email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First1', 'Last1', 'email1@email.com'],
                    ]
                });
            });
            it('should return the rest of the line if there is more data', function () {
                var data = 'first_name,last_name,email_address\r\nFirst1,Last1,email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, true, myParser)).toEqual({
                    line: 'First1,Last1,email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
            });
            it('should accept new data and return the result', function () {
                var data = 'first_name,last_name,email_address\r\nFirst1,Last1,email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'First1,Last1,email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
                expect(parse("".concat(parsedData.line, "\r\nFirst2,Last2,email2@email.com"), false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['First1', 'Last1', 'email1@email.com'],
                        ['First2', 'Last2', 'email2@email.com'],
                    ]
                });
            });
            it('should not parse a row if a new line is not found and there is more data', function () {
                var data = 'first_name,last_name,email_address';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'first_name,last_name,email_address',
                    rows: []
                });
            });
            it('should not parse a row if a new line is incomplete and there is more data', function () {
                var data = 'first_name,last_name,email_address\r';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'first_name,last_name,email_address\r',
                    rows: []
                });
            });
            it('should not parse a row if there is a trailing delimiter and there is more data', function () {
                var data = 'first_name,last_name,email_address,';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: 'first_name,last_name,email_address,',
                    rows: []
                });
            });
            it('should parse a row if a new line is found and there is more data', function () {
                var data = 'first_name,last_name,email_address\r\n';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
            });
        });
        describe('escaped values', function () {
            it('should parse a block of CSV text', function () {
                var data = 'first_name,last_name,email_address\r\n"First,1","Last,1","email1@email.com"';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First,1', 'Last,1', 'email1@email.com'],
                    ]
                });
            });
            it('should parse a block of CSV text with escaped escaped char', function () {
                var data = 'first_name,last_name,email_address\r\n"First,""1""","Last,""1""","email1@email.com"';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First,"1"', 'Last,"1"', 'email1@email.com'],
                    ]
                });
            });
            it('should parse a block of CSV text with alternate escape char', function () {
                var data = 'first_name,last_name,email_address\r\n"First,\\"1\\"","Last,\\"1\\"","email1@email.com"';
                var myParser = createParser({ delimiter: ',', escape: '\\' });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['First,"1"', 'Last,"1"', 'email1@email.com'],
                    ]
                });
            });
            it('should return the rest of the line if a complete value is not found', function () {
                var data = 'first_name,last_name,email_address\r\n"First,""1""","Last,""1""","email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                expect(parse(data, true, myParser)).toEqual({
                    line: '"First,""1""","Last,""1""","email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
            });
            it('should accept more data appended to the returned line with escaped values', function () {
                var data = 'first_name,last_name,email_address\r\n"First,""1""","Last,""1""","email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"First,""1""","Last,""1""","email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
                expect(parse("".concat(parsedData.line, "\"\r\n\"First,\"\"2\"\"\",\"Last,\"\"2\"\"\",\"email2@email.com\""), false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['First,"1"', 'Last,"1"', 'email1@email.com'],
                        ['First,"2"', 'Last,"2"', 'email2@email.com'],
                    ]
                });
            });
            it('should throw an error if there is not more data and there is an invalid escape sequence', function () {
                var data = 'first_name,last_name,email_address\r\n"First,""1""","Last,""1""","email1@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"First,""1""","Last,""1""","email1@email.com',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
                expect(function () {
                    myParser.parse("".concat(parsedData.line, "\r\n\"First,\"\",2\"\"\",\"Last\"\"2\"\"\",\"email2@email.com\""), false);
                }).toThrow(/Parse Error: expected: ',' OR new line got: 'F'. at 'First,"",2/);
            });
            it('should handle empty values properly', function () {
                var data = '"","",""\r\n,Last4,email4@email.com';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, false, myParser);
                expect(parsedData).toEqual({
                    line: '',
                    rows: [
                        ['', '', ''],
                        ['', 'Last4', 'email4@email.com'],
                    ]
                });
            });
            it('should not parse a row if a new line is not found and there is more data', function () {
                var data = '"first_name","last_name","email_address"';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"first_name","last_name","email_address"',
                    rows: []
                });
            });
            it('should not parse a row if there is a trailing delimiter and there is more data', function () {
                var data = '"first_name","last_name","email_address",';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '"first_name","last_name","email_address",',
                    rows: []
                });
            });
            it('should parse a row if a new line is found and there is more data', function () {
                var data = '"first_name","last_name","email_address"\r\n';
                var myParser = createParser({ delimiter: ',' });
                var parsedData = parse(data, true, myParser);
                expect(parsedData).toEqual({
                    line: '',
                    rows: [['first_name', 'last_name', 'email_address']]
                });
            });
        });
        describe('null quote', function () {
            it('should ignore escaping if quote is null', function () {
                var data = 'first_name,last_name,email_address\r\n"First1","Last1","email1@email.com"';
                var myParser = createParser({ delimiter: ',', quote: null });
                expect(parse(data, false, myParser)).toEqual({
                    line: '',
                    rows: [
                        ['first_name', 'last_name', 'email_address'],
                        ['"First1"', '"Last1"', '"email1@email.com"'],
                    ]
                });
            });
        });
    });
    describe('with comments', function () {
        it('should parse a block of CSV text', function () {
            var data = 'first_name,last_name,email_address\n#The first row of data\nFirst1,Last1,email1@email.com';
            var myParser = createParser({ delimiter: ',', comment: '#' });
            expect(parse(data, false, myParser)).toEqual({
                line: '',
                rows: [
                    ['first_name', 'last_name', 'email_address'],
                    ['First1', 'Last1', 'email1@email.com'],
                ]
            });
        });
        it('should return the rest of the line if there is more data', function () {
            var data = 'first_name,last_name,email_address\n#First1,Last1,email1@email.com';
            var myParser = createParser({ delimiter: ',', comment: '#' });
            expect(parse(data, true, myParser)).toEqual({
                line: '#First1,Last1,email1@email.com',
                rows: [['first_name', 'last_name', 'email_address']]
            });
        });
        it('should accept new data and return the result', function () {
            var data = 'first_name,last_name,email_address\n#This is a comment';
            var myParser = createParser({ delimiter: ',', comment: '#' });
            var parsedData = parse(data, true, myParser);
            expect(parsedData).toEqual({
                line: '#This is a comment',
                rows: [['first_name', 'last_name', 'email_address']]
            });
            expect(parse("".concat(parsedData.line, "\nFirst1,Last1,email1@email.com\nFirst2,Last2,email2@email.com"), false, myParser)).toEqual({
                line: '',
                rows: [
                    ['First1', 'Last1', 'email1@email.com'],
                    ['First2', 'Last2', 'email2@email.com'],
                ]
            });
        });
        it('should not parse a row if a new line is not found and there is more data', function () {
            var data = '#first_name,last_name,email_address';
            var myParser = createParser({ delimiter: ',', comment: '#' });
            var parsedData = parse(data, true, myParser);
            expect(parsedData).toEqual({
                line: '#first_name,last_name,email_address',
                rows: []
            });
        });
        it('should not parse data as a comment if it is contained in a line', function () {
            var data = 'f#irst_name,last_name,email_address';
            var myParser = createParser({ delimiter: ',', comment: '#' });
            var parsedData = parse(data, false, myParser);
            expect(parsedData).toEqual({
                line: '',
                rows: [['f#irst_name', 'last_name', 'email_address']]
            });
        });
        it('should not parse data as a comment if it at the beginning but escaped', function () {
            var data = '"#first_name",last_name,email_address';
            var myParser = createParser({ delimiter: ',', comment: '#' });
            var parsedData = parse(data, false, myParser);
            expect(parsedData).toEqual({
                line: '',
                rows: [['#first_name', 'last_name', 'email_address']]
            });
        });
        it('should return empty rows if it is all comments as there is no more data and there is not a final row delimiter', function () {
            var data = '#Comment1\n#Comment2';
            var myParser = createParser({ delimiter: ',', comment: '#' });
            var parsedData = parse(data, false, myParser);
            expect(parsedData).toEqual({
                line: '',
                rows: []
            });
        });
        it('should return empty rows if it is all comments as there is no more data and there is a final row delimiter', function () {
            var data = '#Comment1\n#Comment2\n';
            var myParser = createParser({ delimiter: ',', comment: '#' });
            var parsedData = parse(data, false, myParser);
            expect(parsedData).toEqual({
                line: '',
                rows: []
            });
        });
    });
});
