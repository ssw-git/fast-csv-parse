"use strict";
exports.__esModule = true;
var os_1 = require("os");
var parser_1 = require("../../src/parser");
var ParserOptions_1 = require("../../src/ParserOptions");
describe('Issue #174 - https://github.com/C2FO/fast-csv/issues/174', function () {
    var createParser = function (parserOptions) {
        if (parserOptions === void 0) { parserOptions = {}; }
        return new parser_1.Parser(new ParserOptions_1.ParserOptions(parserOptions));
    };
    var runParser = function (data, hasMoreData, parser) { return parser.parse(data, hasMoreData); };
    var CSV_CONTENT = ['f1,f2,f3', '1,text, a1', '2,text, a2 '].join(os_1.EOL);
    it('skip trailing whitespace after a quoted field', function () {
        var parser = createParser({ headers: true });
        var parsedData = runParser(CSV_CONTENT, false, parser);
        expect(parsedData).toEqual({
            line: '',
            rows: [
                ['f1', 'f2', 'f3'],
                ['1', 'text', ' a1'],
                ['2', 'text', ' a2 '],
            ]
        });
    });
});
