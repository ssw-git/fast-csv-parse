"use strict";
exports.__esModule = true;
exports.expectParsed = exports.parseContentAndCollectFromStream = exports.collectData = void 0;
var collectData = function (stream) {
    return new Promise(function (res, rej) {
        var rows = [];
        var invalidRows = [];
        stream
            .on('data', function (row) { return rows.push(row); })
            .on('data-invalid', function (row) { return invalidRows.push(row); })
            .on('error', rej)
            .on('end', function (count) {
            res({ count: count, rows: rows, invalidRows: invalidRows });
        });
    });
};
exports.collectData = collectData;
var parseContentAndCollectFromStream = function (data, parser) {
    return new Promise(function (res, rej) {
        var rows = [];
        var invalidRows = [];
        parser
            .on('data', function (row) { return rows.push(row); })
            .on('data-invalid', function (row) { return invalidRows.push(row); })
            .on('error', rej)
            .on('end', function (count) {
            res({ count: count, rows: rows, invalidRows: invalidRows });
        });
        parser.write(data.content);
        parser.end();
    });
};
exports.parseContentAndCollectFromStream = parseContentAndCollectFromStream;
var expectParsed = function (resultsPromise, expectedRows, expectedInvalidRows) {
    if (expectedInvalidRows === void 0) { expectedInvalidRows = []; }
    return expect(resultsPromise).resolves.toEqual({
        count: expectedRows.length + expectedInvalidRows.length,
        rows: expectedRows,
        invalidRows: expectedInvalidRows
    });
};
exports.expectParsed = expectParsed;
