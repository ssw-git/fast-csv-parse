"use strict";
exports.__esModule = true;
var os_1 = require("os");
var src_1 = require("../../src");
describe('Issue #356 - https://github.com/C2FO/fast-csv/issues/356', function () {
    var CSV_CONTENT = ['clicks', "1", '2', 'a'].join(os_1.EOL);
    var expectedRows = [{ clicks: 1 }, { clicks: 2 }, {}];
    it('allow transforming to any object shape', function () {
        return new Promise(function (res, rej) {
            var invalid = [];
            var rows = [];
            (0, src_1.parseString)(CSV_CONTENT, { headers: true, escape: "'" })
                .transform(function (row) {
                var clicks = parseInt(row.clicks, 10);
                if (Number.isInteger(clicks)) {
                    return { clicks: clicks };
                }
                return {};
            })
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
