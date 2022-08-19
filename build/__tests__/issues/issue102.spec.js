"use strict";
exports.__esModule = true;
var path_1 = require("path");
var src_1 = require("../../src");
describe('Issue #102 - https://github.com/C2FO/fast-csv/issues/102', function () {
    var row = [
        '123456',
        '123456',
        '2018-02-01T16:05:16Z',
        '7',
        '80428',
        '65756',
        'Unquoted_String_With_Underscores_Hypens And_Spaces And-Numbers 1',
        '{"JSON":"DATA"}',
    ];
    it('parse all rows', function () {
        return new Promise(function (res, rej) {
            var receivedRows = 0;
            (0, src_1.parseFile)((0, path_1.resolve)(__dirname, '__fixtures__', 'issue102.csv'))
                .on('data-invalid', function () { return rej(new Error('Should not have received data-invalid event')); })
                .on('data', function (r) {
                receivedRows += 1;
                if (receivedRows % 1000 !== 0) {
                    return;
                }
                expect(r).toEqual(row);
            })
                .on('error', function (err) { return rej(err); })
                .on('end', function (rowCount) {
                expect(rowCount).toBe(100000);
                expect(receivedRows).toBe(rowCount);
                res();
            });
        });
    });
});
