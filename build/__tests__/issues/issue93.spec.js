"use strict";
exports.__esModule = true;
var domain = require("domain");
var os_1 = require("os");
var csv = require("../../src");
describe('Issue #93 - https://github.com/C2FO/fast-csv/issues/93', function () {
    var csvContent = ['a,b', 'c,d', 'e,f'].join(os_1.EOL);
    it('should not catch errors thrown in end with headers enabled', function () {
        return new Promise(function (res, rej) {
            var d = domain.create();
            var called = false;
            d.on('error', function (err) {
                d.exit();
                if (called) {
                    throw err;
                }
                called = true;
                expect(err.message).toBe('End error');
                res();
            });
            d.run(function () {
                return csv
                    .parseString(csvContent, { headers: true, delimiter: '\t' })
                    .on('error', function () { return rej(new Error('Should not get here!')); })
                    .on('data', function () {
                    /* do nothing */
                })
                    .on('end', function () {
                    throw new Error('End error');
                });
            });
        });
    });
    it('should not catch errors thrown in end with headers disabled', function () {
        return new Promise(function (res, rej) {
            var d = domain.create();
            var called = false;
            d.on('error', function (err) {
                d.exit();
                if (called) {
                    throw err;
                }
                called = true;
                expect(err.message).toBe('End error');
                res();
            });
            d.run(function () {
                return csv
                    .parseString(csvContent, { headers: false })
                    .on('error', function () { return rej(new Error('Should not get here!')); })
                    .on('data', function () {
                    /* do nothing */
                })
                    .on('end', function () {
                    throw new Error('End error');
                });
            });
        });
    });
});
