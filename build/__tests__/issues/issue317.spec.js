"use strict";
exports.__esModule = true;
var os_1 = require("os");
var src_1 = require("../../src");
describe('Issue #317 - https://github.com/C2FO/fast-csv/issues/317', function () {
    var CSV_CONTENT = ['header1,header2', 'col1', 'col2,col2', 'col3', 'col4,col4', 'col5,col5', 'col6,col6'].join(os_1.EOL);
    var expectedInvalidRows = [['col3']];
    var expectedRows = [
        { header1: 'col4', header2: 'col4' },
        { header1: 'col5', header2: 'col5' },
        { header1: 'col6', header2: 'col6' },
    ];
    it('skip trailing whitespace after a quoted field', function () {
        return new Promise(function (res, rej) {
            var invalid = [];
            var rows = [];
            (0, src_1.parseString)(CSV_CONTENT, { headers: true, skipRows: 2, strictColumnHandling: true, maxRows: 4 })
                .on('data-invalid', function (row) { return invalid.push(row); })
                .on('data', function (r) { return rows.push(r); })
                .on('error', rej)
                .on('end', function (count) {
                expect(rows).toEqual(expectedRows);
                expect(invalid).toEqual(expectedInvalidRows);
                expect(count).toBe(expectedRows.length + invalid.length);
                res();
            });
        });
    });
});
