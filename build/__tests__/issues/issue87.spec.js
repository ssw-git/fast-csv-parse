"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var stream_1 = require("stream");
var csv = require("../../src");
describe('Issue #87 - https://github.com/C2FO/fast-csv/issues/87', function () {
    var MyStream = /** @class */ (function (_super) {
        __extends(MyStream, _super);
        function MyStream() {
            var _this = _super.call(this, {
                objectMode: true,
                highWaterMark: 16,
                transform: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.transform.apply(_this, args);
                },
                flush: function (done) { return done(); }
            }) || this;
            _this.rowCount = 0;
            return _this;
        }
        MyStream.prototype.transform = function (data, encoding, done) {
            this.rowCount += 1;
            if (this.rowCount % 2 === 0) {
                setTimeout(function () { return done(); }, 10);
            }
            else {
                done();
            }
        };
        return MyStream;
    }(stream_1.Transform));
    it('should not emit end until data is flushed from source', function () {
        return new Promise(function (res, rej) {
            var myStream = new MyStream();
            fs.createReadStream(path.resolve(__dirname, '__fixtures__', 'issue87.csv'))
                .pipe(csv.parse({ headers: true }))
                .on('error', rej)
                .pipe(myStream)
                .on('error', rej)
                .on('finish', function () {
                expect(myStream.rowCount).toBe(99);
                res();
            });
        });
    });
});
