"use strict";
exports.__esModule = true;
var src_1 = require("../../src");
var parser_1 = require("../../src/parser");
describe('RowParser', function () {
    var parse = function (line, hasMoreData, parserOpts) {
        if (hasMoreData === void 0) { hasMoreData = false; }
        if (parserOpts === void 0) { parserOpts = {}; }
        var parserOptions = new src_1.ParserOptions(parserOpts);
        var rowParser = new parser_1.RowParser(parserOptions);
        var scanner = new parser_1.Scanner({ line: line, parserOptions: parserOptions, hasMoreData: hasMoreData });
        return { scanner: scanner, row: rowParser.parse(scanner) };
    };
    describe('#parse', function () {
        describe('hasMoreData == true', function () {
            it('should not parse a row that does not have a row delimiter', function () {
                var line = 'first_name,last_name,email_address';
                var _a = parse(line, true), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe(line);
                expect(row).toBeNull();
            });
            it('should parse and empty row', function () {
                var line = ',,\n';
                var _a = parse(line, true), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['', '', '']);
            });
            it('should parse and empty row with quotes with trailing delimiter', function () {
                var line = '"","","","",\n';
                var _a = parse(line, true), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['', '', '', '', '']);
            });
            it('should parse and empty row with quotes without trailing delimiter', function () {
                var line = '"","","",""\n';
                var _a = parse(line, true), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['', '', '', '']);
            });
            it('should parse a row that does have a LF', function () {
                var line = 'first_name,last_name,email_address\n';
                var _a = parse(line, true), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['first_name', 'last_name', 'email_address']);
            });
            it('should parse a row that has a LF in a quoted column', function () {
                var line = '"first\nname",last_name,email_address\n';
                var _a = parse(line, true), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['first\nname', 'last_name', 'email_address']);
            });
            it('should parse a row that has a CR in a quoted column', function () {
                var line = '"first\rname",last_name,email_address\n';
                var _a = parse(line, true), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['first\rname', 'last_name', 'email_address']);
            });
            it('should parse a row that has a CRLF in a quoted column', function () {
                var line = '"first\r\nname",last_name,email_address\n';
                var _a = parse(line, true), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['first\r\nname', 'last_name', 'email_address']);
            });
            it('should parse a row with a "\\t" delimiter with fields that have spaces', function () {
                var line = '058B        \t09/09/2003\tGL\tARONCA\t58    \t0191006\t1H7\t1          \t  \t  \tA751    \tAERONCA058B\n';
                var _a = parse(line, true, { delimiter: '\t' }), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual([
                    '058B        ',
                    '09/09/2003',
                    'GL',
                    'ARONCA',
                    '58    ',
                    '0191006',
                    '1H7',
                    '1          ',
                    '  ',
                    '  ',
                    'A751    ',
                    'AERONCA058B',
                ]);
            });
            it('should parse a row that does have a CR/LF', function () {
                var line = 'first_name,last_name,email_address\r\n';
                var _a = parse(line, true), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['first_name', 'last_name', 'email_address']);
            });
            it('should not parse a row that does have a CR but no LF', function () {
                var line = 'first_name,last_name,email_address\r';
                var _a = parse(line, true), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe(line);
                expect(row).toBeNull();
            });
            it('should not parse a row that does have a CR but no LF but is followed by more data', function () {
                var line = 'first_name,last_name,email_address\rFirst1';
                var _a = parse(line, true), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('First1');
                expect(row).toEqual(['first_name', 'last_name', 'email_address']);
            });
        });
        describe('hasMoreData == false', function () {
            it('should parse a row that does not have a row delimiter', function () {
                var line = 'first_name,last_name,email_address';
                var _a = parse(line, false), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['first_name', 'last_name', 'email_address']);
            });
            it('should parse a row that does have a LF', function () {
                var line = 'first_name,last_name,email_address\n';
                var _a = parse(line, false), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['first_name', 'last_name', 'email_address']);
            });
            it('should parse a row that does have a CR/LF', function () {
                var line = 'first_name,last_name,email_address\r\n';
                var _a = parse(line, false), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['first_name', 'last_name', 'email_address']);
            });
            it('should parse a row that does have a CR but no LF', function () {
                var line = 'first_name,last_name,email_address\r';
                var _a = parse(line, false), scanner = _a.scanner, row = _a.row;
                expect(scanner.line).toBe('');
                expect(row).toEqual(['first_name', 'last_name', 'email_address']);
            });
        });
    });
});
