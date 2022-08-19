"use strict";
exports.__esModule = true;
var path = require("path");
var domain = require("domain");
var csv = require("../../src");
describe('Issue #68 - https://github.com/C2FO/fast-csv/issues/68', function () {
    it('should handle bubble up parse errors properly', function () {
        return new Promise(function (res) {
            var d = domain.create();
            var called = false;
            d.on('error', function (err) {
                d.exit();
                if (called) {
                    return;
                }
                called = true;
                expect(err.message).toMatch(/^Parse Error/);
                res();
            });
            d.run(function () {
                return csv
                    .parseFile(path.resolve(__dirname, '__fixtures__', 'issue68-invalid.tsv'), {
                    headers: true,
                    delimiter: '\t'
                })
                    .on('data', function () { return null; });
            });
        });
    });
    it('should handle bubble up data errors properly', function () {
        return new Promise(function (res) {
            var d = domain.create();
            var called = false;
            d.on('error', function (err) {
                d.exit();
                if (called) {
                    throw err;
                }
                called = true;
                expect(err.message).toBe('Data error');
                res();
            });
            d.run(function () {
                var count = 0;
                csv.parseFile(path.resolve(__dirname, '__fixtures__', 'issue68.tsv'), {
                    headers: true,
                    delimiter: '\t'
                }).on('data', function () {
                    count += 1;
                    if (count % 1001 === 0) {
                        throw new Error('Data error');
                    }
                });
            });
        });
    });
});
