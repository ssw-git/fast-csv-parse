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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.CsvParserStream = void 0;
var string_decoder_1 = require("string_decoder");
var stream_1 = require("stream");
var transforms_1 = require("./transforms");
var parser_1 = require("./parser");
var CsvParserStream = /** @class */ (function (_super) {
    __extends(CsvParserStream, _super);
    function CsvParserStream(parserOptions) {
        var _this = _super.call(this, { objectMode: parserOptions.objectMode }) || this;
        _this.lines = '';
        _this.rowCount = 0;
        _this.parsedRowCount = 0;
        _this.parsedLineCount = 0;
        _this.endEmitted = false;
        _this.headersEmitted = false;
        _this.parserOptions = parserOptions;
        _this.parser = new parser_1.Parser(parserOptions);
        _this.headerTransformer = new transforms_1.HeaderTransformer(parserOptions);
        _this.decoder = new string_decoder_1.StringDecoder(parserOptions.encoding);
        _this.rowTransformerValidator = new transforms_1.RowTransformerValidator();
        return _this;
    }
    Object.defineProperty(CsvParserStream.prototype, "hasHitRowLimit", {
        get: function () {
            return this.parserOptions.limitRows && this.rowCount >= this.parserOptions.maxRows;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CsvParserStream.prototype, "shouldEmitRows", {
        get: function () {
            return this.parsedRowCount > this.parserOptions.skipRows;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CsvParserStream.prototype, "shouldSkipLine", {
        get: function () {
            return this.parsedLineCount <= this.parserOptions.skipLines;
        },
        enumerable: false,
        configurable: true
    });
    CsvParserStream.prototype.transform = function (transformFunction) {
        this.rowTransformerValidator.rowTransform = transformFunction;
        return this;
    };
    CsvParserStream.prototype.validate = function (validateFunction) {
        this.rowTransformerValidator.rowValidator = validateFunction;
        return this;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CsvParserStream.prototype.emit = function (event) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (event === 'end') {
            if (!this.endEmitted) {
                this.endEmitted = true;
                _super.prototype.emit.call(this, 'end', this.rowCount);
            }
            return false;
        }
        return _super.prototype.emit.apply(this, __spreadArray([event], rest, false));
    };
    CsvParserStream.prototype._transform = function (data, encoding, done) {
        // if we have hit our maxRows parsing limit then skip parsing
        if (this.hasHitRowLimit) {
            return done();
        }
        var wrappedCallback = CsvParserStream.wrapDoneCallback(done);
        try {
            var lines = this.lines;
            var newLine = lines + this.decoder.write(data);
            var rows = this.parse(newLine, true);
            return this.processRows(rows, wrappedCallback);
        }
        catch (e) {
            return wrappedCallback(e);
        }
    };
    CsvParserStream.prototype._flush = function (done) {
        var wrappedCallback = CsvParserStream.wrapDoneCallback(done);
        // if we have hit our maxRows parsing limit then skip parsing
        if (this.hasHitRowLimit) {
            return wrappedCallback();
        }
        try {
            var newLine = this.lines + this.decoder.end();
            var rows = this.parse(newLine, false);
            return this.processRows(rows, wrappedCallback);
        }
        catch (e) {
            return wrappedCallback(e);
        }
    };
    CsvParserStream.prototype.parse = function (data, hasMoreData) {
        if (!data) {
            return [];
        }
        var _a = this.parser.parse(data, hasMoreData), line = _a.line, rows = _a.rows;
        this.lines = line;
        return rows;
    };
    CsvParserStream.prototype.processRows = function (rows, cb) {
        var _this = this;
        var rowsLength = rows.length;
        var iterate = function (i) {
            var callNext = function (err) {
                if (err) {
                    return cb(err);
                }
                if (i % 100 === 0) {
                    // incase the transform are sync insert a next tick to prevent stack overflow
                    setImmediate(function () { return iterate(i + 1); });
                    return undefined;
                }
                return iterate(i + 1);
            };
            _this.checkAndEmitHeaders();
            // if we have emitted all rows or we have hit the maxRows limit option
            // then end
            if (i >= rowsLength || _this.hasHitRowLimit) {
                return cb();
            }
            _this.parsedLineCount += 1;
            if (_this.shouldSkipLine) {
                return callNext();
            }
            var row = rows[i];
            _this.rowCount += 1;
            _this.parsedRowCount += 1;
            var nextRowCount = _this.rowCount;
            return _this.transformRow(row, function (err, transformResult) {
                if (err) {
                    _this.rowCount -= 1;
                    return callNext(err);
                }
                if (!transformResult) {
                    return callNext(new Error('expected transform result'));
                }
                if (!transformResult.isValid) {
                    _this.emit('data-invalid', transformResult.row, nextRowCount, transformResult.reason);
                }
                else if (transformResult.row) {
                    return _this.pushRow(transformResult.row, callNext);
                }
                return callNext();
            });
        };
        iterate(0);
    };
    CsvParserStream.prototype.transformRow = function (parsedRow, cb) {
        var _this = this;
        try {
            this.headerTransformer.transform(parsedRow, function (err, withHeaders) {
                if (err) {
                    return cb(err);
                }
                if (!withHeaders) {
                    return cb(new Error('Expected result from header transform'));
                }
                if (!withHeaders.isValid) {
                    if (_this.shouldEmitRows) {
                        return cb(null, { isValid: false, row: parsedRow });
                    }
                    // skipped because of skipRows option remove from total row count
                    return _this.skipRow(cb);
                }
                if (withHeaders.row) {
                    if (_this.shouldEmitRows) {
                        return _this.rowTransformerValidator.transformAndValidate(withHeaders.row, cb);
                    }
                    // skipped because of skipRows option remove from total row count
                    return _this.skipRow(cb);
                }
                // this is a header row dont include in the rowCount or parsedRowCount
                _this.rowCount -= 1;
                _this.parsedRowCount -= 1;
                return cb(null, { row: null, isValid: true });
            });
        }
        catch (e) {
            cb(e);
        }
    };
    CsvParserStream.prototype.checkAndEmitHeaders = function () {
        if (!this.headersEmitted && this.headerTransformer.headers) {
            this.headersEmitted = true;
            this.emit('headers', this.headerTransformer.headers);
        }
    };
    CsvParserStream.prototype.skipRow = function (cb) {
        // skipped because of skipRows option remove from total row count
        this.rowCount -= 1;
        return cb(null, { row: null, isValid: true });
    };
    CsvParserStream.prototype.pushRow = function (row, cb) {
        try {
            if (!this.parserOptions.objectMode) {
                this.push(JSON.stringify(row));
            }
            else {
                this.push(row);
            }
            cb();
        }
        catch (e) {
            cb(e);
        }
    };
    CsvParserStream.wrapDoneCallback = function (done) {
        var errorCalled = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return function (err) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (err) {
                if (errorCalled) {
                    throw err;
                }
                errorCalled = true;
                done(err);
                return;
            }
            done.apply(void 0, args);
        };
    };
    return CsvParserStream;
}(stream_1.Transform));
exports.CsvParserStream = CsvParserStream;
