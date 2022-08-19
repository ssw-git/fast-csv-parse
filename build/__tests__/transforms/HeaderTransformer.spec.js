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
var src_1 = require("../../src");
var transforms_1 = require("../../src/transforms");
describe('HeaderTransformer', function () {
    var createHeaderTransformer = function (opts) {
        return new transforms_1.HeaderTransformer(new src_1.ParserOptions(opts));
    };
    var transform = function (row, transformer) {
        return new Promise(function (res, rej) {
            transformer.transform(row, function (err, results) {
                if (err) {
                    return rej(err);
                }
                if (!results) {
                    return rej(new Error('No error or results found'));
                }
                return res(results);
            });
        });
    };
    describe('#transform', function () {
        it('should return a valid row', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['a', 'b'];
                        transformer = createHeaderTransformer({ headers: false });
                        return [4 /*yield*/, expect(transform(row, transformer)).resolves.toEqual({ row: row, isValid: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return a null row that is still valid if headers is true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['a', 'b'];
                        transformer = createHeaderTransformer({ headers: true });
                        return [4 /*yield*/, expect(transform(row, transformer)).resolves.toEqual({ row: null, isValid: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return a row with mapped headers if headers is an array', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['a', 'b'];
                        transformer = createHeaderTransformer({ headers: ['header1', 'header2'] });
                        return [4 /*yield*/, expect(transform(row, transformer)).resolves.toEqual({
                                row: { header1: 'a', header2: 'b' },
                                isValid: true
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should skip columns with an undefined header', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['a', 'b', 'c'];
                        transformer = createHeaderTransformer({ headers: ['header1', undefined, 'header2'] });
                        return [4 /*yield*/, expect(transform(row, transformer)).resolves.toEqual({
                                row: { header1: 'a', header2: 'c' },
                                isValid: true
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should skip the first row if renameHeaders is true and headers is an array', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row1, row2, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row1 = ['origHeader1', 'origHeader2'];
                        row2 = ['a', 'b'];
                        transformer = createHeaderTransformer({ headers: ['header1', 'header2'], renameHeaders: true });
                        return [4 /*yield*/, expect(transform(row1, transformer)).resolves.toEqual({ row: null, isValid: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(transform(row2, transformer)).resolves.toEqual({
                                row: { header1: 'a', header2: 'b' },
                                isValid: true
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should skip the first row if headers is function and properly map the headers to the row', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row1, row2, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row1 = ['origHeader1', 'origHeader2'];
                        row2 = ['a', 'b'];
                        transformer = createHeaderTransformer({
                            headers: function (headers) { return headers.map(function (h) { return h === null || h === void 0 ? void 0 : h.toUpperCase(); }); }
                        });
                        return [4 /*yield*/, expect(transform(row1, transformer)).resolves.toEqual({ row: null, isValid: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(transform(row2, transformer)).resolves.toEqual({
                                row: { ORIGHEADER1: 'a', ORIGHEADER2: 'b' },
                                isValid: true
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if headers is true and the first row is not unique', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row1, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row1 = ['origHeader1', 'origHeader1', 'origHeader2'];
                        transformer = createHeaderTransformer({ headers: true });
                        return [4 /*yield*/, expect(transform(row1, transformer)).rejects.toThrow('Duplicate headers found ["origHeader1"]')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if headers is an array and is not unique', function () {
            var headers = ['origHeader1', 'origHeader1', 'origHeader2'];
            expect(function () { return createHeaderTransformer({ headers: headers }); }).toThrow('Duplicate headers found ["origHeader1"]');
        });
        it('should throw an error if headers is a transform and returns non-unique values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['h1', 'h2', 'h3'];
                        transformer = createHeaderTransformer({ headers: function () { return ['h1', 'h1', 'h3']; } });
                        return [4 /*yield*/, expect(transform(row, transformer)).rejects.toThrow('Duplicate headers found ["h1"]')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if headers is not defined and renameHeaders is true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row1, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row1 = ['origHeader1', 'origHeader2'];
                        transformer = createHeaderTransformer({ renameHeaders: true });
                        return [4 /*yield*/, expect(transform(row1, transformer)).rejects.toThrow('Error renaming headers: new headers must be provided in an array')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if the row length is > than the headers length as strictColumnHandling is not defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['a', 'b', 'c'];
                        transformer = createHeaderTransformer({ headers: ['header1', 'header2'] });
                        return [4 /*yield*/, expect(transform(row, transformer)).rejects.toThrow('Unexpected Error: column header mismatch expected: 2 columns got: 3')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw an error if the row length is > than the headers length as strictColumnHandling is false', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['a', 'b', 'c'];
                        transformer = createHeaderTransformer({
                            headers: ['header1', 'header2'],
                            strictColumnHandling: false
                        });
                        return [4 /*yield*/, expect(transform(row, transformer)).rejects.toThrow('Unexpected Error: column header mismatch expected: 2 columns got: 3')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should mark the row as invalid if the row length is > than the headers length as strictColumnHandling is true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['a', 'b', 'c'];
                        transformer = createHeaderTransformer({
                            headers: ['header1', 'header2'],
                            strictColumnHandling: true
                        });
                        return [4 /*yield*/, expect(transform(row, transformer)).resolves.toEqual({
                                row: row,
                                isValid: false,
                                reason: 'Column header mismatch expected: 2 columns got: 3'
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return a mapped row if row length is < than the headers length as strictColumnHandling is not defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['a'];
                        transformer = createHeaderTransformer({ headers: ['header1', 'header2'] });
                        return [4 /*yield*/, expect(transform(row, transformer)).resolves.toEqual({
                                row: { header1: 'a', header2: '' },
                                isValid: true
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return a mapped row if row length is < than the headers length as strictColumnHandling is not false', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['a'];
                        transformer = createHeaderTransformer({
                            headers: ['header1', 'header2'],
                            strictColumnHandling: false
                        });
                        return [4 /*yield*/, expect(transform(row, transformer)).resolves.toEqual({
                                row: { header1: 'a', header2: '' },
                                isValid: true
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should mark the row as invalid if the row length is < than the headers length as strictColumnHandling is true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['a'];
                        transformer = createHeaderTransformer({
                            headers: ['header1', 'header2'],
                            strictColumnHandling: true
                        });
                        return [4 /*yield*/, expect(transform(row, transformer)).resolves.toEqual({
                                row: row,
                                isValid: false,
                                reason: 'Column header mismatch expected: 2 columns got: 1'
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
