"use strict";
exports.__esModule = true;
var src_1 = require("../../../src");
var column_1 = require("../../../src/parser/column");
var parser_1 = require("../../../src/parser");
describe('NonQuotedColumnParser', function () {
    var parse = function (line, hasMoreData, parserOpts) {
        if (hasMoreData === void 0) { hasMoreData = false; }
        if (parserOpts === void 0) { parserOpts = {}; }
        var parserOptions = new src_1.ParserOptions(parserOpts);
        var columnParser = new column_1.NonQuotedColumnParser(parserOptions);
        var scanner = new parser_1.Scanner({ line: line, parserOptions: parserOptions, hasMoreData: hasMoreData });
        return { scanner: scanner, col: columnParser.parse(scanner) };
    };
    describe('#parse', function () {
        describe('with default delimiter', function () {
            it('should return the same scanner if there is no data', function () {
                var line = '';
                var parserOptions = new src_1.ParserOptions({});
                var lineParser = new column_1.NonQuotedColumnParser(parserOptions);
                var scanner = new parser_1.Scanner({ line: line, parserOptions: parserOptions, hasMoreData: true });
                expect(lineParser.parse(scanner)).toBeNull();
            });
            it('should parse a column up to a column delimiter', function () {
                var line = 'hello,world';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe(',world');
            });
            it('should parse a column when not followed by any characters', function () {
                var line = 'hello';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should parse a column up to a LF', function () {
                var line = 'hello\nworld';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\nworld');
            });
            it('should parse a column up to a CR', function () {
                var line = 'hello\rworld';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\rworld');
            });
            it('should parse a column up to a CRLF', function () {
                var line = 'hello\r\nworld';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\r\nworld');
            });
            describe('trim options', function () {
                it('should trim the item', function () {
                    var line = '   hello   ';
                    var _a = parse(line, true, { trim: true }), scanner = _a.scanner, col = _a.col;
                    expect(col).toBe('hello');
                    expect(scanner.lineFromCursor).toBe('');
                });
                it('should ltrim the item', function () {
                    var line = '   hello   ';
                    var _a = parse(line, true, { ltrim: true }), scanner = _a.scanner, col = _a.col;
                    expect(col).toBe('hello   ');
                    expect(scanner.lineFromCursor).toBe('');
                });
                it('should rtrim the item', function () {
                    var line = '   hello   ';
                    var _a = parse(line, true, { rtrim: true }), scanner = _a.scanner, col = _a.col;
                    expect(col).toBe('   hello');
                    expect(scanner.lineFromCursor).toBe('');
                });
            });
        });
        describe('with non-default delimiter', function () {
            it('should return the same scanner if there is no data', function () {
                var line = '';
                var parserOptions = new src_1.ParserOptions({ delimiter: '\t' });
                var lineParser = new column_1.NonQuotedColumnParser(parserOptions);
                var scanner = new parser_1.Scanner({ line: line, parserOptions: parserOptions, hasMoreData: true });
                expect(lineParser.parse(scanner)).toBeNull();
                expect(scanner).toBe(scanner);
            });
            it('should parse a column when not followed by any characters', function () {
                var line = 'hello';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should parse a column up to the column delimiter', function () {
                var line = 'hello\tworld';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\tworld');
            });
            it('should include all white space up to a column delimiter', function () {
                var line = '    \t    ';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('    ');
                expect(scanner.lineFromCursor).toBe('\t    ');
            });
            it('should parse a column up to a LF', function () {
                var line = 'hello\nworld';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\nworld');
            });
            it('should parse a column up to a CR', function () {
                var line = 'hello\rworld';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\rworld');
            });
            it('should parse a column up to a CRLF', function () {
                var line = 'hello\r\nworld';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\r\nworld');
            });
            describe('trim options', function () {
                it('should trim white space from both ends when trim is true', function () {
                    var line = '   hello   \t';
                    var _a = parse(line, true, { delimiter: '\t', trim: true }), scanner = _a.scanner, col = _a.col;
                    expect(col).toBe('hello');
                    expect(scanner.lineFromCursor).toBe('\t');
                });
                it('should trim white space from the left when ltrim is true', function () {
                    var line = '   hello   \t';
                    var _a = parse(line, true, { delimiter: '\t', ltrim: true }), scanner = _a.scanner, col = _a.col;
                    expect(col).toBe('hello   ');
                    expect(scanner.lineFromCursor).toBe('\t');
                });
                it('should trim white space from the right when rtrim is true', function () {
                    var line = '   hello   \t';
                    var _a = parse(line, true, { delimiter: '\t', ltrim: true }), scanner = _a.scanner, col = _a.col;
                    expect(col).toBe('hello   ');
                    expect(scanner.lineFromCursor).toBe('\t');
                });
            });
        });
    });
});
