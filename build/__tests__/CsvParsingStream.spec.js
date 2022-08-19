"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var domain = require("domain");
var lodash_partition_1 = require("lodash.partition");
var src_1 = require("../src");
var __fixtures__1 = require("./__fixtures__");
describe('CsvParserStream', function () {
    var createParserStream = function (args) {
        return new src_1.CsvParserStream(new src_1.ParserOptions(args));
    };
    var expectErrorEvent = function (stream, message, resolve, reject) {
        var called = false;
        stream
            .on('error', function (err) {
            expect(err.message).toBe(message);
            if (!called) {
                called = true;
                resolve();
            }
        })
            .on('end', function () { return reject(new Error("Expected and error to occur [expectedMessage=".concat(message, "]"))); });
    };
    var parseContentAndCollect = function (data, options) {
        if (options === void 0) { options = {}; }
        return (0, __fixtures__1.parseContentAndCollectFromStream)(data, createParserStream(options));
    };
    it('should parse a csv without quotes or escapes', function () {
        return (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeaders, { headers: true }), __fixtures__1.withHeaders.parsed);
    });
    it('should emit a readable event', function () {
        return new Promise(function (res, rej) {
            var actual = [];
            var parser = createParserStream({ headers: true });
            var stream = parser.on('error', rej).on('end', function (count) {
                expect(actual).toEqual(__fixtures__1.withHeaders.parsed);
                expect(count).toBe(actual.length);
                res();
            });
            var index = 0;
            stream.on('readable', function () {
                for (var data = stream.read(); data !== null; data = stream.read()) {
                    actual[index] = data;
                    index += 1;
                }
            });
            stream.write(__fixtures__1.withHeaders.content);
            stream.end();
        });
    });
    it('should emit data as a buffer if objectMode is false', function () { return __awaiter(void 0, void 0, void 0, function () {
        var expected;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expected = __fixtures__1.withHeaders.parsed.map(function (r) { return Buffer.from(JSON.stringify(r)); });
                    return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeaders, { headers: true, objectMode: false }), expected)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should emit data as an object if objectMode is true', function () {
        return (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeaders, { headers: true, objectMode: true }), __fixtures__1.withHeaders.parsed);
    });
    it('should emit data as an object if objectMode is not specified', function () {
        return (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeaders, { headers: true }), __fixtures__1.withHeaders.parsed);
    });
    it('should parse a csv with quotes', function () {
        return (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeadersAndQuotes, { headers: true }), __fixtures__1.withHeadersAndQuotes.parsed);
    });
    it('should parse a csv with without headers', function () {
        return (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.noHeadersAndQuotes), __fixtures__1.noHeadersAndQuotes.parsed);
    });
    it("should parse a csv with ' escapes", function () {
        return (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeadersAndAlternateQuote, { headers: true, quote: "'" }), __fixtures__1.withHeadersAndAlternateQuote.parsed);
    });
    describe('headers option', function () {
        it('should allow specifying of headers', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expected = __fixtures__1.noHeadersAndQuotes.parsed.map(function (r) { return ({
                            first_name: r[0],
                            last_name: r[1],
                            email_address: r[2],
                            address: r[3]
                        }); });
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.noHeadersAndQuotes, {
                                headers: ['first_name', 'last_name', 'email_address', 'address']
                            }), expected)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow transforming headers with a function', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expected, transform;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expected = __fixtures__1.withHeadersAndQuotes.parsed.map(function (r) { return ({
                            firstName: r.first_name,
                            lastName: r.last_name,
                            emailAddress: r.email_address,
                            address: r.address
                        }); });
                        transform = jest.fn().mockReturnValue(['firstName', 'lastName', 'emailAddress', 'address']);
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeadersAndQuotes, { headers: transform }), expected)];
                    case 1:
                        _a.sent();
                        expect(transform).toHaveBeenCalledTimes(1);
                        expect(transform).toHaveBeenCalledWith(['first_name', 'last_name', 'email_address', 'address']);
                        return [2 /*return*/];
                }
            });
        }); });
        describe('renameHeaders option', function () {
            it('should allow renaming headers', function () { return __awaiter(void 0, void 0, void 0, function () {
                var expected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expected = __fixtures__1.withHeadersAndQuotes.parsed.map(function (r) { return ({
                                firstName: r.first_name,
                                lastName: r.last_name,
                                emailAddress: r.email_address,
                                address: r.address
                            }); });
                            return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeadersAndQuotes, {
                                    headers: ['firstName', 'lastName', 'emailAddress', 'address'],
                                    renameHeaders: true
                                }), expected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should ignore the renameHeaders option if transforming headers with a function', function () { return __awaiter(void 0, void 0, void 0, function () {
                var expected, transform;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expected = __fixtures__1.withHeadersAndQuotes.parsed.map(function (r) { return ({
                                firstName: r.first_name,
                                lastName: r.last_name,
                                emailAddress: r.email_address,
                                address: r.address
                            }); });
                            transform = jest.fn().mockReturnValue(['firstName', 'lastName', 'emailAddress', 'address']);
                            return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeadersAndQuotes, { headers: transform, renameHeaders: true }), expected)];
                        case 1:
                            _a.sent();
                            expect(transform).toHaveBeenCalledTimes(1);
                            expect(transform).toHaveBeenCalledWith(['first_name', 'last_name', 'email_address', 'address']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should propagate an error when trying to rename headers without providing new ones', function () {
                return new Promise(function (res, rej) {
                    var stream = createParserStream({ renameHeaders: true });
                    expectErrorEvent(stream, 'Error renaming headers: new headers must be provided in an array', res, rej);
                    stream.write(__fixtures__1.withHeadersAndQuotes.content);
                    stream.end();
                });
            });
            it('should propagate an error when trying to rename headers without providing proper ones', function () {
                return new Promise(function (res, rej) {
                    var stream = createParserStream({ renameHeaders: true, headers: true });
                    expectErrorEvent(stream, 'Error renaming headers: new headers must be provided in an array', res, rej);
                    stream.write(__fixtures__1.withHeadersAndQuotes.content);
                    stream.end();
                });
            });
        });
        it('should propagate an error header length does not match column length', function () {
            return new Promise(function (res, rej) {
                var stream = createParserStream({ headers: true });
                expectErrorEvent(stream, 'Unexpected Error: column header mismatch expected: 4 columns got: 5', res, rej);
                stream.write(__fixtures__1.headerColumnMismatch.content);
                stream.end();
            });
        });
        it('should propagate an error if headers are not unique', function () {
            return new Promise(function (res, rej) {
                var stream = createParserStream({ headers: true });
                expectErrorEvent(stream, 'Duplicate headers found ["first_name"]', res, rej);
                stream.write(__fixtures__1.duplicateHeaders.content);
                stream.end();
            });
        });
        it('should discard extra columns that do not map to a header when discardUnmappedColumns is true', function () {
            return (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.headerColumnMismatch, { headers: true, discardUnmappedColumns: true }), __fixtures__1.headerColumnMismatch.parsed);
        });
        it('should report missing columns that do not exist but have a header with strictColumnHandling option', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedRows, expectedInvalidRows;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        expectedRows = (_a = __fixtures__1.withHeadersAndMissingColumns.parsed) === null || _a === void 0 ? void 0 : _a.filter(function (r) { return r.address !== null; });
                        expectedInvalidRows = __fixtures__1.withHeadersAndMissingColumns.parsed
                            .filter(function (r) { return r.address === null; })
                            .map(function (r) { return Object.values(r).filter(function (v) { return !!v; }); });
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeadersAndMissingColumns, {
                                headers: true,
                                strictColumnHandling: true
                            }), expectedRows, expectedInvalidRows)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow specifying of columns as a sparse array', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expected = __fixtures__1.noHeadersAndQuotes.parsed.map(function (r) { return ({
                            first_name: r[0],
                            email_address: r[2]
                        }); });
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.noHeadersAndQuotes, {
                                headers: ['first_name', undefined, 'email_address', undefined]
                            }), expected)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should parse data with an alternate encoding', function () {
        return (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.alternateEncoding, { headers: true, encoding: 'utf16le' }), __fixtures__1.alternateEncoding.parsed);
    });
    it('should handle a trailing comma', function () {
        return (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.trailingComma, { headers: true }), __fixtures__1.trailingComma.parsed);
    });
    it('should skip valid, but empty rows when ignoreEmpty is true', function () {
        return (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.emptyRows, { headers: true, ignoreEmpty: true }), []);
    });
    describe('alternate delimiters', function () {
        ['\t', '|', ';'].forEach(function (delimiter) {
            it("should support '".concat(delimiter.replace(/\t/, '\\t'), "' delimiters"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var asset;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            asset = (0, __fixtures__1.withHeadersAlternateDelimiter)(delimiter);
                            return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(asset, { headers: true, delimiter: delimiter }), asset.parsed)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('maxRows option', function () {
        it('should parse up to the specified number of maxRows', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maxRows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maxRows = 3;
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeaders, { headers: true, maxRows: maxRows }), __fixtures__1.withHeaders.parsed.slice(0, maxRows))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should parse all rows if maxRows === 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maxRows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maxRows = 0;
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeaders, { headers: true, maxRows: maxRows }), __fixtures__1.withHeaders.parsed)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('skipLines option', function () {
        it('should skip up to the specified number of rows using the first non-skipped line as headers', function () { return __awaiter(void 0, void 0, void 0, function () {
            var linesToSkip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linesToSkip = 2;
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeadersAndSkippedLines, { headers: true, skipLines: linesToSkip }), __fixtures__1.withHeadersAndSkippedLines.parsed)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should skip up to the specified number of rows not withoutHeaders', function () { return __awaiter(void 0, void 0, void 0, function () {
            var linesToSkip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linesToSkip = 2;
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.skipLines, { skipLines: linesToSkip }), __fixtures__1.skipLines.parsed)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('with transform', function () {
            it('should not transform skipped rows', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transformedRows, transformer, linesToSkip, expected, parser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transformedRows = [];
                            transformer = function (row) {
                                var transformed = {
                                    firstName: row.first_name,
                                    lastName: row.last_name,
                                    emailAddress: row.email_address
                                };
                                transformedRows.push(transformed);
                                return transformed;
                            };
                            linesToSkip = 2;
                            expected = __fixtures__1.withHeadersAndSkippedLines.parsed.map(transformer);
                            transformedRows = [];
                            parser = createParserStream({ headers: true, skipLines: linesToSkip }).transform(transformer);
                            return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.withHeadersAndSkippedLines, parser), expected)];
                        case 1:
                            _a.sent();
                            expect(transformedRows).toEqual(expected);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('with validate', function () {
            it('should not validate skipped rows', function () { return __awaiter(void 0, void 0, void 0, function () {
                var validatedRows, validator, linesToSkip, nonSkippedRows, _a, expected, invalid, parser;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            validatedRows = [];
                            validator = function (row) {
                                validatedRows.push(row);
                                return (validatedRows.length - 1) % 2 === 0;
                            };
                            linesToSkip = 2;
                            nonSkippedRows = __fixtures__1.withHeadersAndSkippedLines.parsed;
                            _a = (0, lodash_partition_1["default"])(nonSkippedRows, validator), expected = _a[0], invalid = _a[1];
                            validatedRows = [];
                            parser = createParserStream({ headers: true, skipLines: linesToSkip }).validate(validator);
                            return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.withHeadersAndSkippedLines, parser), expected, invalid)];
                        case 1:
                            _b.sent();
                            expect(validatedRows).toEqual(nonSkippedRows);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('should parse all rows if maxRows === 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var linesToSkip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linesToSkip = 0;
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeaders, { headers: true, skipLines: linesToSkip }), __fixtures__1.withHeaders.parsed)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('skipRows option', function () {
        describe('with headers', function () {
            it('should skip up to the specified number of rows not including the header row in the count', function () { return __awaiter(void 0, void 0, void 0, function () {
                var skipRows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            skipRows = 3;
                            return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeaders, { headers: true, skipRows: skipRows }), __fixtures__1.withHeaders.parsed.slice(skipRows))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should skip up to the specified number of rows and allow renaming the headers', function () { return __awaiter(void 0, void 0, void 0, function () {
                var skipRows, expected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            skipRows = 3;
                            expected = __fixtures__1.withHeaders.parsed.slice(skipRows).map(function (r) {
                                return {
                                    h1: r.first_name,
                                    h2: r.last_name,
                                    h3: r.email_address
                                };
                            });
                            return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeaders, {
                                    headers: ['h1', 'h2', 'h3'],
                                    renameHeaders: true,
                                    skipRows: skipRows
                                }), expected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('strict column handling', function () {
                it('should include the invalid rows when counting rows to skip', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var expectedRows;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                expectedRows = __fixtures__1.withHeadersAndMissingColumns.parsed;
                                return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeadersAndMissingColumns, {
                                        headers: true,
                                        strictColumnHandling: true,
                                        skipRows: 2
                                    }), expectedRows.slice(-1), [])];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        describe('without headers', function () {
            it('should skip up to the specified number of rows without headers', function () { return __awaiter(void 0, void 0, void 0, function () {
                var skipRows, expected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            skipRows = 3;
                            expected = __fixtures__1.noHeadersAndQuotes.parsed.slice(skipRows);
                            return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.noHeadersAndQuotes, { skipRows: skipRows }), expected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should skip up to the specified number of rows without headers and allow specifying headers', function () { return __awaiter(void 0, void 0, void 0, function () {
                var skipRows, expected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            skipRows = 3;
                            expected = __fixtures__1.noHeadersAndQuotes.parsed.slice(skipRows).map(function (r) {
                                return {
                                    h1: r[0],
                                    h2: r[1],
                                    h3: r[2],
                                    h4: r[3]
                                };
                            });
                            return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.noHeadersAndQuotes, { headers: ['h1', 'h2', 'h3', 'h4'], skipRows: skipRows }), expected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('with transform', function () {
            it('should not transform skipped rows', function () { return __awaiter(void 0, void 0, void 0, function () {
                var transformedRows, transformer, skipRows, expected, parser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transformedRows = [];
                            transformer = function (row) {
                                var transformed = {
                                    firstName: row.first_name,
                                    lastName: row.last_name,
                                    emailAddress: row.email_address,
                                    address: row.address
                                };
                                transformedRows.push(transformed);
                                return transformed;
                            };
                            skipRows = 3;
                            expected = __fixtures__1.withHeaders.parsed.slice(skipRows).map(transformer);
                            transformedRows = [];
                            parser = createParserStream({ headers: true, skipRows: skipRows }).transform(transformer);
                            return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.withHeaders, parser), expected)];
                        case 1:
                            _a.sent();
                            expect(transformedRows).toEqual(expected);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('with validate', function () {
            it('should not validate skipped rows', function () { return __awaiter(void 0, void 0, void 0, function () {
                var validatedRows, validator, skipRows, nonSkippedRows, _a, expected, invalid, parser;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            validatedRows = [];
                            validator = function (row) {
                                validatedRows.push(row);
                                return (validatedRows.length - 1) % 2 === 0;
                            };
                            skipRows = 3;
                            nonSkippedRows = __fixtures__1.withHeaders.parsed.slice(skipRows);
                            _a = (0, lodash_partition_1["default"])(nonSkippedRows, validator), expected = _a[0], invalid = _a[1];
                            validatedRows = [];
                            parser = createParserStream({ headers: true, skipRows: skipRows }).validate(validator);
                            return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.withHeaders, parser), expected, invalid)];
                        case 1:
                            _b.sent();
                            expect(validatedRows).toEqual(nonSkippedRows);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('should parse all rows if maxRows === 0', function () { return __awaiter(void 0, void 0, void 0, function () {
            var skipRows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skipRows = 0;
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)(parseContentAndCollect(__fixtures__1.withHeaders, { headers: true, skipRows: skipRows }), __fixtures__1.withHeaders.parsed)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should emit an error for malformed rows', function () {
        return new Promise(function (res, rej) {
            (0, __fixtures__1.write)(__fixtures__1.malformed);
            var stream = (0, src_1.parseFile)(__fixtures__1.malformed.path, { headers: true });
            expectErrorEvent(stream, "Parse Error: expected: ',' OR new line got: 'a'. at 'a   \", Las'", res, rej);
        });
    });
    describe('headers event', function () {
        it('should emit a headers event one time when headers are discovered', function () { return __awaiter(void 0, void 0, void 0, function () {
            var parsedHeaders, eventCount, stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsedHeaders = [];
                        eventCount = 0;
                        stream = createParserStream({ headers: true });
                        stream.on('headers', function (hs) {
                            eventCount += 1;
                            parsedHeaders.push.apply(parsedHeaders, hs);
                        });
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.withHeaders, stream), __fixtures__1.withHeaders.parsed)];
                    case 1:
                        _a.sent();
                        expect(eventCount).toBe(1);
                        expect(parsedHeaders).toEqual(['first_name', 'last_name', 'email_address']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should emit a headers event one time with transformed headers', function () { return __awaiter(void 0, void 0, void 0, function () {
            var parsedHeaders, eventCount, headersTransform, stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsedHeaders = [];
                        eventCount = 0;
                        headersTransform = function (hs) { return hs.map(function (h) { return h === null || h === void 0 ? void 0 : h.toUpperCase(); }); };
                        stream = createParserStream({ headers: headersTransform });
                        stream.on('headers', function (hs) {
                            eventCount += 1;
                            parsedHeaders.push.apply(parsedHeaders, hs);
                        });
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.withHeaders, stream), __fixtures__1.withHeaders.parsed.map(function (r) { return ({
                                FIRST_NAME: r.first_name,
                                LAST_NAME: r.last_name,
                                EMAIL_ADDRESS: r.email_address
                            }); }))];
                    case 1:
                        _a.sent();
                        expect(eventCount).toBe(1);
                        expect(parsedHeaders).toEqual(['FIRST_NAME', 'LAST_NAME', 'EMAIL_ADDRESS']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should emit a headers provided headers', function () { return __awaiter(void 0, void 0, void 0, function () {
            var parsedHeaders, eventCount, headers, stream, expected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsedHeaders = [];
                        eventCount = 0;
                        headers = ['first_name', 'last_name', 'email_address', 'address'];
                        stream = createParserStream({ headers: headers });
                        stream.on('headers', function (hs) {
                            eventCount += 1;
                            parsedHeaders.push.apply(parsedHeaders, hs);
                        });
                        expected = __fixtures__1.noHeadersAndQuotes.parsed.map(function (r) { return ({
                            first_name: r[0],
                            last_name: r[1],
                            email_address: r[2],
                            address: r[3]
                        }); });
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.noHeadersAndQuotes, stream), expected)];
                    case 1:
                        _a.sent();
                        expect(eventCount).toBe(1);
                        expect(parsedHeaders).toEqual(headers);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not a headers provided headers', function () { return __awaiter(void 0, void 0, void 0, function () {
            var parsedHeaders, eventCount, stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsedHeaders = [];
                        eventCount = 0;
                        stream = createParserStream();
                        stream.on('headers', function (hs) {
                            eventCount += 1;
                            parsedHeaders.push.apply(parsedHeaders, hs);
                        });
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.noHeadersAndQuotes, stream), __fixtures__1.noHeadersAndQuotes.parsed)];
                    case 1:
                        _a.sent();
                        expect(eventCount).toBe(0);
                        expect(parsedHeaders).toHaveLength(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('#validate', function () {
        var syncValidator = function (row) {
            return parseInt(row.first_name ? row.first_name.replace(/^First/, '') : '0', 10) % 2 === 1;
        };
        var asyncValidator = function (row, cb) {
            cb(null, syncValidator(row));
        };
        it('should allow validation of rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, valid, invalid, parser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = (0, lodash_partition_1["default"])(__fixtures__1.withHeaders.parsed, syncValidator), valid = _a[0], invalid = _a[1];
                        parser = createParserStream({ headers: true }).validate(syncValidator);
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.withHeaders, parser), valid, invalid)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow async validation of rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            var validator, _a, valid, invalid, parser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validator = function (row) {
                            return parseInt(row.first_name ? row.first_name.replace(/^First/, '') : '0', 10) % 2 === 1;
                        };
                        _a = (0, lodash_partition_1["default"])(__fixtures__1.withHeaders.parsed, validator), valid = _a[0], invalid = _a[1];
                        parser = createParserStream({ headers: true }).validate(asyncValidator);
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.withHeaders, parser), valid, invalid)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should propagate errors from async validation', function () {
            return new Promise(function (res, rej) {
                (0, __fixtures__1.write)(__fixtures__1.withHeaders);
                var index = -1;
                var stream = createParserStream({ headers: true }).validate(function (data, validateNext) {
                    setImmediate(function () {
                        index += 1;
                        if (index === 8) {
                            validateNext(new Error('Validation ERROR!!!!'));
                        }
                        else {
                            validateNext(null, true);
                        }
                    });
                });
                stream.write(__fixtures__1.withHeaders.content);
                stream.end();
                expectErrorEvent(stream, 'Validation ERROR!!!!', res, rej);
            });
        });
        it('should propagate async errors at the beginning', function () {
            return new Promise(function (res, rej) {
                (0, __fixtures__1.write)(__fixtures__1.withHeaders);
                var stream = (0, src_1.parseFile)(__fixtures__1.withHeaders.path, {
                    headers: true
                }).validate(function (data, validateNext) { return validateNext(new Error('Validation ERROR!!!!')); });
                expectErrorEvent(stream, 'Validation ERROR!!!!', res, rej);
            });
        });
        it('should propagate thrown errors', function () {
            return new Promise(function (res, rej) {
                (0, __fixtures__1.write)(__fixtures__1.withHeaders);
                var index = -1;
                var stream = (0, src_1.parseFile)(__fixtures__1.withHeaders.path, { headers: true }).validate(function (data, validateNext) {
                    index += 1;
                    if (index === 8) {
                        throw new Error('Validation ERROR!!!!');
                    }
                    else {
                        setImmediate(function () { return validateNext(null, true); });
                    }
                });
                expectErrorEvent(stream, 'Validation ERROR!!!!', res, rej);
            });
        });
        it('should propagate thrown errors at the beginning', function () {
            return new Promise(function (res, rej) {
                (0, __fixtures__1.write)(__fixtures__1.withHeaders);
                var stream = (0, src_1.parseFile)(__fixtures__1.withHeaders.path, { headers: true }).validate(function () {
                    throw new Error('Validation ERROR!!!!');
                });
                expectErrorEvent(stream, 'Validation ERROR!!!!', res, rej);
            });
        });
        it('should throw an error if validate is not called with a function', function () {
            // @ts-ignore
            expect(function () { return createParserStream({ headers: true }).validate('hello'); }).toThrow('The validate should be a function');
        });
    });
    describe('#transform', function () {
        var transformer = function (row) { return ({
            firstName: row.first_name,
            lastName: row.last_name,
            emailAddress: row.email_address,
            address: row.address
        }); };
        it('should allow transforming of data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expected, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expected = __fixtures__1.withHeaders.parsed.map(transformer);
                        parser = createParserStream({ headers: true }).transform(transformer);
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.withHeaders, parser), expected)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should async transformation of data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expected, parser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expected = __fixtures__1.withHeaders.parsed.map(transformer);
                        parser = createParserStream({ headers: true }).transform(function (row, next) {
                            return setImmediate(function () { return next(null, transformer(row)); });
                        });
                        return [4 /*yield*/, (0, __fixtures__1.expectParsed)((0, __fixtures__1.parseContentAndCollectFromStream)(__fixtures__1.withHeaders, parser), expected)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should propogate errors when transformation of data', function () {
            return new Promise(function (res, rej) {
                (0, __fixtures__1.write)(__fixtures__1.withHeaders);
                var index = -1;
                var stream = (0, src_1.parseFile)(__fixtures__1.withHeaders.path, { headers: true }).transform(function (data, cb) {
                    return setImmediate(function () {
                        index += 1;
                        if (index === 8) {
                            cb(new Error('transformation ERROR!!!!'));
                        }
                        else {
                            cb(null, transformer(data));
                        }
                    });
                });
                expectErrorEvent(stream, 'transformation ERROR!!!!', res, rej);
            });
        });
        it('should propogate errors when transformation of data at the beginning', function () {
            return new Promise(function (res, rej) {
                (0, __fixtures__1.write)(__fixtures__1.withHeaders);
                var stream = (0, src_1.parseFile)(__fixtures__1.withHeaders.path, { headers: true }).transform(function (data, cb) {
                    return setImmediate(function () { return cb(new Error('transformation ERROR!!!!')); });
                });
                expectErrorEvent(stream, 'transformation ERROR!!!!', res, rej);
            });
        });
        it('should propagate thrown errors at the end', function () {
            return new Promise(function (res, rej) {
                (0, __fixtures__1.write)(__fixtures__1.withHeaders);
                var index = -1;
                var stream = (0, src_1.parseFile)(__fixtures__1.withHeaders.path, { headers: true }).transform(function (data, cb) {
                    index += 1;
                    if (index === 8) {
                        throw new Error('transformation ERROR!!!!');
                    }
                    else {
                        setImmediate(function () { return cb(null, data); });
                    }
                });
                expectErrorEvent(stream, 'transformation ERROR!!!!', res, rej);
            });
        });
        it('should propagate thrown errors at the beginning', function () {
            return new Promise(function (res, rej) {
                (0, __fixtures__1.write)(__fixtures__1.withHeaders);
                var stream = (0, src_1.parseFile)(__fixtures__1.withHeaders.path, { headers: true }).transform(function () {
                    throw new Error('transformation ERROR!!!!');
                });
                expectErrorEvent(stream, 'transformation ERROR!!!!', res, rej);
            });
        });
        it('should throw an error if a transform is not called with a function', function () {
            // @ts-ignore
            expect(function () { return createParserStream({ headers: true }).transform('hello'); }).toThrow('The transform should be a function');
        });
    });
    describe('pause/resume', function () {
        it('should support pausing a stream', function () {
            (0, __fixtures__1.write)(__fixtures__1.withHeaders);
            return new Promise(function (res, rej) {
                var rows = [];
                var paused = false;
                var stream = createParserStream({ headers: true });
                fs.createReadStream(__fixtures__1.withHeaders.path)
                    .on('error', rej)
                    .pipe(stream)
                    .on('data', function (row) {
                    expect(paused).toBe(false);
                    rows.push(row);
                    paused = true;
                    stream.pause();
                    setTimeout(function () {
                        expect(paused).toBe(true);
                        paused = false;
                        stream.resume();
                    }, 100);
                })
                    .on('error', rej)
                    .on('end', function (count) {
                    expect(rows).toEqual(__fixtures__1.withHeaders.parsed);
                    expect(count).toBe(rows.length);
                    res();
                });
            });
        });
    });
    it('should not catch errors thrown in end', function () {
        return new Promise(function (res, rej) {
            (0, __fixtures__1.write)(__fixtures__1.withHeaders);
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
                return fs
                    .createReadStream(__fixtures__1.withHeaders.path)
                    .on('error', rej)
                    .pipe(createParserStream({ headers: true }))
                    .on('error', function () { return rej(new Error('Should not get here!')); })
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    .on('data', function () { })
                    .on('end', function () {
                    throw new Error('End error');
                });
            });
        });
    });
});
