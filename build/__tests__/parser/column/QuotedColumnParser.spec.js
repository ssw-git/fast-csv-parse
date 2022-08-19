"use strict";
exports.__esModule = true;
var src_1 = require("../../../src");
var column_1 = require("../../../src/parser/column");
var parser_1 = require("../../../src/parser");
describe('QuotedColumnParser', function () {
    var parse = function (line, hasMoreData, parserOpts) {
        if (hasMoreData === void 0) { hasMoreData = false; }
        if (parserOpts === void 0) { parserOpts = {}; }
        var parserOptions = new src_1.ParserOptions(parserOpts);
        var columnParser = new column_1.QuotedColumnParser(parserOptions);
        var scanner = new parser_1.Scanner({ line: line, parserOptions: parserOptions, hasMoreData: hasMoreData });
        return { scanner: scanner, col: columnParser.parse(scanner) };
    };
    describe('#parse', function () {
        describe('with default delimiter', function () {
            it('should return the same scanner if there is no data', function () {
                var line = '';
                var parserOptions = new src_1.ParserOptions({});
                var lineParser = new column_1.QuotedColumnParser(parserOptions);
                var scanner = new parser_1.Scanner({ line: line, parserOptions: parserOptions, hasMoreData: true });
                expect(lineParser.parse(scanner)).toBeNull();
                expect(scanner).toBe(scanner);
            });
            it('should parse a quoted col when not followed by any characters', function () {
                var line = '"hello"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should not parse a quoted col when not followed by any characters', function () {
                var line = '"hello,';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBeNull();
                expect(scanner.lineFromCursor).toBe('"hello,');
            });
            it('should parse a quoted col up to a column delimiter', function () {
                var line = '"hello","world"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe(',"world"');
            });
            it('should parse a quoted col up to a column delimiter with a LF in the column', function () {
                var line = '"hel\nlo","world"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hel\nlo');
                expect(scanner.lineFromCursor).toBe(',"world"');
            });
            it('should parse a quoted col up to a column delimiter with a CR in the column', function () {
                var line = '"hel\rlo","world"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hel\rlo');
                expect(scanner.lineFromCursor).toBe(',"world"');
            });
            it('should parse a quoted col up to a column delimiter with a CRLF in the column', function () {
                var line = '"hel\r\nlo","world"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hel\r\nlo');
                expect(scanner.lineFromCursor).toBe(',"world"');
            });
            it('should parse a quoted col up to a LF', function () {
                var line = '"hello"\n"world"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\n"world"');
            });
            it('should parse a quoted col up to a CR', function () {
                var line = '"hello"\r"world"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\r"world"');
            });
            it('should parse a quoted col up to a CRLF', function () {
                var line = '"hello"\r\n"world"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\r\n"world"');
            });
            it('should parse a quoted column with escaped quotes when not followed by any characters', function () {
                var line = '"hell""o"""';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should parse a quoted column with escaped quotes when followed by a delimiter', function () {
                var line = '"hell""o""","world"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe(',"world"');
            });
            it('should parse a quoted column with escaped quotes when followed by a LF', function () {
                var line = '"hell""o"""\n"world"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('\n"world"');
            });
            it('should parse a quoted column with escaped quotes when followed by a CR', function () {
                var line = '"hell""o"""\r"world"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('\r"world"');
            });
            it('should parse a quoted column with escaped quotes when followed by a CRLF', function () {
                var line = '"hell""o"""\r\n"world"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('\r\n"world"');
            });
            it('should skip white space after a quote up to the column delimiter', function () {
                var line = '"Hello"    ,"World"';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('Hello');
                expect(scanner.lineFromCursor).toBe(',"World"');
            });
            it('should skip white space after a quote up to a LF', function () {
                var line = '"Hello"    \n';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('Hello');
                expect(scanner.lineFromCursor).toBe('\n');
            });
            it('should skip white space after a quote up to a CR', function () {
                var line = '"Hello"    \r';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('Hello');
                expect(scanner.lineFromCursor).toBe('\r');
            });
            it('should skip white space after a quote up to a CRLF', function () {
                var line = '"Hello"    \r\n';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('Hello');
                expect(scanner.lineFromCursor).toBe('\r\n');
            });
            it('should skip white space after a quote if has more data is false and there is no new line', function () {
                var line = '"Hello"    ';
                var _a = parse(line, false), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('Hello');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should include all quoted white space up to a column delimiter', function () {
                var line = '"    ","    "';
                var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('    ');
                expect(scanner.lineFromCursor).toBe(',"    "');
            });
            it('should throw an error if a column contains a closing quote that is not followed by a row or column delimiter', function () {
                var line = '"hello\n"First';
                expect(function () { return parse(line, true); }).toThrow(/Parse Error: expected: ',' OR new line got: 'F'. at 'First/);
                expect(function () { return parse(line, false); }).toThrow(/Parse Error: expected: ',' OR new line got: 'F'. at 'First/);
            });
            describe('hasMoreData is true', function () {
                it('should not parse a column without a closing quote', function () {
                    var line = '"hell""o';
                    var _a = parse(line, true), scanner = _a.scanner, col = _a.col;
                    expect(col).toBeNull();
                    expect(scanner.lineFromCursor).toBe(line);
                });
            });
            describe('hasMoreData is false', function () {
                it('should not parse a column without a closing quote', function () {
                    var line = '"hell""o';
                    expect(function () { return parse(line, false); }).toThrow(/Parse Error: missing closing: '"' in line: at '"hell""o'/);
                });
            });
        });
        describe('with non-default delimiter', function () {
            it('should return the same scanner if there is no data', function () {
                var line = '';
                var parserOptions = new src_1.ParserOptions({ delimiter: '\t' });
                var lineParser = new column_1.QuotedColumnParser(parserOptions);
                var scanner = new parser_1.Scanner({ line: line, parserOptions: parserOptions, hasMoreData: true });
                expect(lineParser.parse(scanner)).toBeNull();
                expect(scanner).toBe(scanner);
            });
            it('should parse a quoted col when not followed by any characters', function () {
                var line = '"hello"';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should parse a quoted col up to a column delimiter', function () {
                var line = '"hello"\t"world"';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\t"world"');
            });
            it('should parse a quoted col up to a LF', function () {
                var line = '"hello"\n"world"';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\n"world"');
            });
            it('should parse a quoted col up to a CR', function () {
                var line = '"hello"\r"world"';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\r"world"');
            });
            it('should parse a quoted col up to a CRLF', function () {
                var line = '"hello"\r\n"world"';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\r\n"world"');
            });
            it('should parse a quoted column with escaped quotes when not followed by any characters', function () {
                var line = '"hell""o"""';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should parse a quoted column with escaped quotes when followed by a delimiter', function () {
                var line = '"hell""o"""\t"world"';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('\t"world"');
            });
            it('should parse a quoted column with escaped quotes when followed by a LF', function () {
                var line = '"hell""o"""\n"world"';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('\n"world"');
            });
            it('should parse a quoted column with escaped quotes when followed by a CR', function () {
                var line = '"hell""o"""\r"world"';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('\r"world"');
            });
            it('should parse a quoted column with escaped quotes when followed by a CRLF', function () {
                var line = '"hell""o"""\r\n"world"';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('\r\n"world"');
            });
            it('should skip white space after a quote up to the column delimiter', function () {
                var line = '"Hello"    \t"World"';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('Hello');
                expect(scanner.lineFromCursor).toBe('\t"World"');
            });
            it('should skip white space after a quote up to a LF', function () {
                var line = '"Hello"    \n';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('Hello');
                expect(scanner.lineFromCursor).toBe('\n');
            });
            it('should skip white space after a quote up to a CR', function () {
                var line = '"Hello"    \r';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('Hello');
                expect(scanner.lineFromCursor).toBe('\r');
            });
            it('should skip white space after a quote up to a CRLF', function () {
                var line = '"Hello"    \r\n';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('Hello');
                expect(scanner.lineFromCursor).toBe('\r\n');
            });
            it('should skip white space after a quote if has more data is false and there is no new line', function () {
                var line = '"Hello"    ';
                var _a = parse(line, false, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('Hello');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should include all quoted white space up to a column delimiter', function () {
                var line = '"    "\t"    "';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('    ');
                expect(scanner.lineFromCursor).toBe('\t"    "');
            });
            it('should throw an error if a column contains a closing quote that is not followed by a row or column delimiter', function () {
                var line = '"hello\n"First';
                expect(function () { return parse(line, true, { delimiter: '\t' }); }).toThrow(/Parse Error: expected: '\t' OR new line got: 'F'. at 'First/);
                expect(function () { return parse(line, false, { delimiter: '\t' }); }).toThrow(/Parse Error: expected: '\t' OR new line got: 'F'. at 'First/);
            });
            describe('hasMoreData is true', function () {
                it('should not parse a column without a closing quote', function () {
                    var line = '"hell""o';
                    var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, col = _a.col;
                    expect(col).toBeNull();
                    expect(scanner.lineFromCursor).toBe(line);
                });
            });
            describe('hasMoreData is false', function () {
                it('should not parse a column without a closing quote', function () {
                    var line = '"hell""o';
                    expect(function () { return parse(line, false, { delimiter: '\t' }); }).toThrow(/Parse Error: missing closing: '"' in line: at '"hell""o'/);
                });
            });
        });
        describe('with non-default quote', function () {
            it('should return the same scanner if there is no data', function () {
                var line = '';
                var parserOptions = new src_1.ParserOptions({ quote: '$' });
                var lineParser = new column_1.QuotedColumnParser(parserOptions);
                var scanner = new parser_1.Scanner({ line: line, parserOptions: parserOptions, hasMoreData: true });
                expect(lineParser.parse(scanner)).toBeNull();
                expect(scanner).toBe(scanner);
            });
            it('should parse a quoted col when not followed by any characters', function () {
                var line = '$hello$';
                var _a = parse(line, true, { quote: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should parse a quoted col up to a column delimiter', function () {
                var line = '$hello$,$world$';
                var _a = parse(line, true, { quote: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe(',$world$');
            });
            it('should parse a quoted col up to a LF', function () {
                var line = '$hello$\n$world$';
                var _a = parse(line, true, { quote: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\n$world$');
            });
            it('should parse a quoted col up to a CR', function () {
                var line = '$hello$\r$world$';
                var _a = parse(line, true, { quote: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\r$world$');
            });
            it('should parse a quoted col up to a CRLF', function () {
                var line = '$hello$\r\n$world$';
                var _a = parse(line, true, { quote: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\r\n$world$');
            });
            it('should parse a quoted column with escaped quotes when not followed by any characters', function () {
                var line = '$hell$$o$$$';
                var _a = parse(line, true, { quote: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell$o$');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should parse a quoted column with escaped quotes when followed by a delimiter', function () {
                var line = '$hell$$o$$$,$world$';
                var _a = parse(line, true, { quote: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell$o$');
                expect(scanner.lineFromCursor).toBe(',$world$');
            });
            it('should parse a quoted column with escaped quotes when followed by a LF', function () {
                var line = '$hell$$o$$$\n$world$';
                var _a = parse(line, true, { quote: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell$o$');
                expect(scanner.lineFromCursor).toBe('\n$world$');
            });
            it('should parse a quoted column with escaped quotes when followed by a CR', function () {
                var line = '$hell$$o$$$\r$world$';
                var _a = parse(line, true, { quote: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell$o$');
                expect(scanner.lineFromCursor).toBe('\r$world$');
            });
            it('should parse a quoted column with escaped quotes when followed by a CRLF', function () {
                var line = '$hell$$o$$$\r\n$world$';
                var _a = parse(line, true, { quote: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell$o$');
                expect(scanner.lineFromCursor).toBe('\r\n$world$');
            });
            it('should throw an error if a column contains a closing quote that is not followed by a row or column delimiter', function () {
                var line = '$hello\n$First';
                expect(function () { return parse(line, true, { quote: '$' }); }).toThrow(/Parse Error: expected: ',' OR new line got: 'F'. at 'First/);
                expect(function () { return parse(line, false, { quote: '$' }); }).toThrow(/Parse Error: expected: ',' OR new line got: 'F'. at 'First/);
            });
            describe('hasMoreData is true', function () {
                it('should not parse a column without a closing quote', function () {
                    var line = '$hell$$o';
                    var _a = parse(line, true, { quote: '$' }), scanner = _a.scanner, col = _a.col;
                    expect(col).toBeNull();
                    expect(scanner.lineFromCursor).toBe(line);
                });
            });
            describe('hasMoreData is false', function () {
                it('should not parse a column without a closing quote', function () {
                    var line = '$hell$$o';
                    expect(function () { return parse(line, false, { quote: '$' }); }).toThrow(/Parse Error: missing closing: '\$' in line: at '\$hell\$\$o'/);
                });
            });
        });
        describe('with non-default escape', function () {
            it('should return the same scanner if there is no data', function () {
                var line = '';
                var parserOptions = new src_1.ParserOptions({ escape: '$' });
                var lineParser = new column_1.QuotedColumnParser(parserOptions);
                var scanner = new parser_1.Scanner({ line: line, parserOptions: parserOptions, hasMoreData: true });
                expect(lineParser.parse(scanner)).toBeNull();
                expect(scanner).toBe(scanner);
            });
            it('should parse a quoted col when not followed by any characters', function () {
                var line = '"hello"';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should parse a quoted col up to a column delimiter', function () {
                var line = '"hello","world"';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe(',"world"');
            });
            it('should parse an escape not followed by a quote', function () {
                var line = '"hell$o","world"';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell$o');
                expect(scanner.lineFromCursor).toBe(',"world"');
            });
            it('should parse an escape followed by another escape', function () {
                var line = '"hello$$","world"';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello$');
                expect(scanner.lineFromCursor).toBe(',"world"');
            });
            it('should parse a quoted col up to a LF', function () {
                var line = '"hello"\n"world"';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\n"world"');
            });
            it('should parse a quoted col up to a CR', function () {
                var line = '"hello"\r"world"';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\r"world"');
            });
            it('should parse a quoted col up to a CRLF', function () {
                var line = '"hello"\r\n"world"';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('\r\n"world"');
            });
            it('should parse a quoted column with escaped quotes when not followed by any characters', function () {
                var line = '"hell$"o$""';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should parse a quoted column with escaped quotes when followed by a delimiter', function () {
                var line = '"hell$"o$"","world"';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe(',"world"');
            });
            it('should parse a quoted column with escaped quotes when followed by a LF', function () {
                var line = '"hell$"o$""\n"world"';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('\n"world"');
            });
            it('should parse a quoted column with escaped quotes when followed by a CR', function () {
                var line = '"hell$"o$""\r"world"';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('\r"world"');
            });
            it('should parse a quoted column with escaped quotes when followed by a CRLF', function () {
                var line = '"hell$"o$""\r\n"world"';
                var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hell"o"');
                expect(scanner.lineFromCursor).toBe('\r\n"world"');
            });
            it('should throw an error if a column contains a closing quote that is not followed by a row or column delimiter', function () {
                var line = '"hello\n"First';
                expect(function () { return parse(line, true, { escape: '$' }); }).toThrow(/Parse Error: expected: ',' OR new line got: 'F'. at 'First/);
                expect(function () { return parse(line, false, { escape: '$' }); }).toThrow(/Parse Error: expected: ',' OR new line got: 'F'. at 'First/);
            });
            describe('hasMoreData is true', function () {
                it('should not parse a column without a closing quote', function () {
                    var line = '"hell$"o';
                    var _a = parse(line, true, { escape: '$' }), scanner = _a.scanner, col = _a.col;
                    expect(col).toBeNull();
                    expect(scanner.lineFromCursor).toBe(line);
                });
            });
            describe('hasMoreData is false', function () {
                it('should not parse a column without a closing quote', function () {
                    var line = '"hell$"o';
                    expect(function () { return parse(line, false, { escape: '$' }); }).toThrow(/Parse Error: missing closing: '"' in line: at '"hell\$"o'/);
                });
            });
        });
        describe('trim options', function () {
            it('should trim the item', function () {
                var line = '"   hello   "';
                var _a = parse(line, true, { trim: true }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should ltrim the item', function () {
                var line = '"   hello   "';
                var _a = parse(line, true, { ltrim: true }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('hello   ');
                expect(scanner.lineFromCursor).toBe('');
            });
            it('should rtrim the item', function () {
                var line = '"   hello   "';
                var _a = parse(line, true, { rtrim: true }), scanner = _a.scanner, col = _a.col;
                expect(col).toBe('   hello');
                expect(scanner.lineFromCursor).toBe('');
            });
        });
    });
});
