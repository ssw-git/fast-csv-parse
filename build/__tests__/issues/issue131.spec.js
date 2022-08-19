"use strict";
exports.__esModule = true;
var os_1 = require("os");
var csv = require("../../src");
describe('Issue #131 - https://github.com/C2FO/fast-csv/issues/131', function () {
    var csvWithBom = [
        '\ufefffirst_name,last_name,email_address,address',
        'First1,Last1,email1@email.com,"1 Street St, State ST, 88888"',
    ].join(os_1.EOL);
    it('should parse a csv with a UTF-8 Byte Order Mark', function () {
        return new Promise(function (res, rej) {
            var actual = [];
            csv.parseString(csvWithBom, { headers: true })
                .on('error', rej)
                .on('data', function (data) { return actual.push(data); })
                .on('end', function (count) {
                expect(actual[0].first_name).toBe('First1');
                expect(count).toBe(actual.length);
                res();
            });
        });
    });
});
