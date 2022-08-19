"use strict";
exports.__esModule = true;
var parser_1 = require("../../src/parser");
var ParserOptions_1 = require("../../src/ParserOptions");
describe('Issue #150 - https://github.com/C2FO/fast-csv/issues/150', function () {
    var createParser = function (parserOptions) {
        if (parserOptions === void 0) { parserOptions = {}; }
        return new parser_1.Parser(new ParserOptions_1.ParserOptions(parserOptions));
    };
    var runParser = function (data, hasMoreData, parser) { return parser.parse(data, hasMoreData); };
    it('should not parse a row if a new line is a CR and there is more data', function () {
        var data = 'first_name,last_name,email_address\r';
        var myParser = createParser({});
        var parsedData = runParser(data, true, myParser);
        expect(parsedData).toEqual({
            line: 'first_name,last_name,email_address\r',
            rows: []
        });
    });
});
