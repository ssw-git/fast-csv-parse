"use strict";
exports.__esModule = true;
var os_1 = require("os");
var parser_1 = require("../../src/parser");
var ParserOptions_1 = require("../../src/ParserOptions");
describe('Issue #223 - https://github.com/C2FO/fast-csv/issues/223', function () {
    var createParser = function (parserOptions) {
        if (parserOptions === void 0) { parserOptions = {}; }
        return new parser_1.Parser(new ParserOptions_1.ParserOptions(parserOptions));
    };
    var runParser = function (data, hasMoreData, parser) { return parser.parse(data, hasMoreData); };
    it('skip trailing whitespace after a quoted field', function () {
        var CSV_CONTENT = ['"ABC"   ,"DEFG"  ,12345,"HI"', '"JKLM"  ,"NOP"   ,67890,"QR"   '].join(os_1.EOL);
        var parser = createParser();
        var parsedData = runParser(CSV_CONTENT, false, parser);
        expect(parsedData).toEqual({
            line: '',
            rows: [
                ['ABC', 'DEFG', '12345', 'HI'],
                ['JKLM', 'NOP', '67890', 'QR'],
            ]
        });
    });
});
