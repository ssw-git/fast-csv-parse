"use strict";
exports.__esModule = true;
var sinon = require("sinon");
var src_1 = require("../../../src");
var column_1 = require("../../../src/parser/column");
var parser_1 = require("../../../src/parser");
describe('ColumnParser', function () {
    describe('#parse', function () {
        describe('with un-quoted data', function () {
            it('should call the nonQuotedColumnParser', function () {
                var line = 'HELLO';
                var parserOptions = new src_1.ParserOptions({});
                var lineParser = new column_1.ColumnParser(parserOptions);
                var scanner = new parser_1.Scanner({ line: line, parserOptions: parserOptions, hasMoreData: true });
                var expectedResult = { scanner: scanner, items: [] };
                var mock = sinon.mock(lineParser.nonQuotedColumnParser);
                mock.expects('parse').once().withArgs(scanner).returns(expectedResult);
                expect(lineParser.parse(scanner)).toEqual(expectedResult);
                mock.verify();
            });
        });
        describe('with quoted data', function () {
            it('should call the quotedColumnParser', function () {
                var line = '"HELLO"';
                var parserOptions = new src_1.ParserOptions({});
                var lineParser = new column_1.ColumnParser(parserOptions);
                var scanner = new parser_1.Scanner({ line: line, parserOptions: parserOptions, hasMoreData: true });
                var expectedResult = { scanner: scanner, items: [] };
                var mock = sinon.mock(lineParser.quotedColumnParser);
                mock.expects('parse').once().withArgs(scanner).returns(expectedResult);
                expect(lineParser.parse(scanner)).toEqual(expectedResult);
                mock.verify();
            });
        });
    });
});
