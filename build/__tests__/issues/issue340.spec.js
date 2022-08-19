"use strict";
exports.__esModule = true;
var os_1 = require("os");
var src_1 = require("../../src");
describe('Issue #340 - https://github.com/C2FO/fast-csv/issues/340', function () {
    var CSV_CONTENT = ['Col1', "\"A '\"Good'\" row''\"", 'Row 2'].join(os_1.EOL);
    var expectedRows = [{ Col1: "A \"Good\" row'" }, { Col1: 'Row 2' }];
    it('handle a trailing escape', function () {
        return new Promise(function (res, rej) {
            var invalid = [];
            var rows = [];
            (0, src_1.parseString)(CSV_CONTENT, { headers: true, escape: "'" })
                .on('data-invalid', function (row) { return invalid.push(row); })
                .on('data', function (r) { return rows.push(r); })
                .on('error', rej)
                .on('end', function (count) {
                expect(rows).toEqual(expectedRows);
                expect(invalid).toHaveLength(0);
                expect(count).toBe(expectedRows.length + invalid.length);
                res();
            });
        });
    });
});
