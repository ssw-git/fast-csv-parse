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
var transforms_1 = require("../../src/transforms");
describe('RowTransformerValidator', function () {
    var createRowTransformerValidator = function () { return new transforms_1.RowTransformerValidator(); };
    var transformAndValidate = function (row, transformer) {
        return new Promise(function (res, rej) {
            transformer.transformAndValidate(row, function (err, results) {
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
    describe('#transformAndValidate', function () {
        it('should return a valid row if validator and transform are not defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var row, transformer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = ['a', 'b'];
                        transformer = createRowTransformerValidator();
                        return [4 /*yield*/, expect(transformAndValidate(row, transformer)).resolves.toEqual({ row: row, isValid: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('#rowTransform', function () {
            it('should throw an error if the transform is not a function', function () {
                var transformer = createRowTransformerValidator();
                expect(function () {
                    // @ts-ignore
                    transformer.rowTransform = 'foo';
                }).toThrow('The transform should be a function');
            });
            it('should transform a row synchronously', function () { return __awaiter(void 0, void 0, void 0, function () {
                var row, transformer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            row = ['a', 'b'];
                            transformer = createRowTransformerValidator();
                            transformer.rowTransform = function (r) { return r.map(function (col) { return col.toUpperCase(); }); };
                            return [4 /*yield*/, expect(transformAndValidate(row, transformer)).resolves.toEqual({
                                    row: ['A', 'B'],
                                    isValid: true
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should resolve with an error if the transform throws an error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var row, transformer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            row = ['a', 'b'];
                            transformer = createRowTransformerValidator();
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            transformer.rowTransform = function (r) {
                                throw new Error('Expected error');
                            };
                            return [4 /*yield*/, expect(transformAndValidate(row, transformer)).rejects.toThrow('Expected error')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should transform a row asynchronously', function () { return __awaiter(void 0, void 0, void 0, function () {
                var row, transformer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            row = ['a', 'b'];
                            transformer = createRowTransformerValidator();
                            transformer.rowTransform = function (r, cb) {
                                setImmediate(function () {
                                    cb(null, r.map(function (col) { return col.toUpperCase(); }));
                                });
                            };
                            return [4 /*yield*/, expect(transformAndValidate(row, transformer)).resolves.toEqual({
                                    row: ['A', 'B'],
                                    isValid: true
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should resolve with an error if an error is provided to the callback', function () { return __awaiter(void 0, void 0, void 0, function () {
                var row, transformer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            row = ['a', 'b'];
                            transformer = createRowTransformerValidator();
                            transformer.rowTransform = function (r, cb) {
                                setImmediate(function () {
                                    cb(new Error('Expected error'));
                                });
                            };
                            return [4 /*yield*/, expect(transformAndValidate(row, transformer)).rejects.toThrow('Expected error')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('#rowValidator', function () {
            it('should throw an error if the validator is not a function', function () {
                var transformer = createRowTransformerValidator();
                expect(function () {
                    // @ts-ignore
                    transformer.rowValidator = 'foo';
                }).toThrow('The validate should be a function');
            });
            it('should validate a row synchronously', function () { return __awaiter(void 0, void 0, void 0, function () {
                var row, transformer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            row = ['a', 'b'];
                            transformer = createRowTransformerValidator();
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            transformer.rowValidator = function (r) { return false; };
                            return [4 /*yield*/, expect(transformAndValidate(row, transformer)).resolves.toEqual({
                                    row: row,
                                    isValid: false,
                                    reason: undefined
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should validate a row asynchronously', function () { return __awaiter(void 0, void 0, void 0, function () {
                var row, transformer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            row = ['a', 'b'];
                            transformer = createRowTransformerValidator();
                            transformer.rowValidator = function (r, cb) {
                                setImmediate(function () {
                                    cb(null, false);
                                });
                            };
                            return [4 /*yield*/, expect(transformAndValidate(row, transformer)).resolves.toEqual({
                                    row: row,
                                    isValid: false,
                                    reason: undefined
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should validate a row asynchronously with a reason', function () { return __awaiter(void 0, void 0, void 0, function () {
                var row, transformer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            row = ['a', 'b'];
                            transformer = createRowTransformerValidator();
                            transformer.rowValidator = function (r, cb) {
                                setImmediate(function () {
                                    cb(null, false, 'just because');
                                });
                            };
                            return [4 /*yield*/, expect(transformAndValidate(row, transformer)).resolves.toEqual({
                                    row: row,
                                    isValid: false,
                                    reason: 'just because'
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should resolve with an error if the validate throws an error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var row, transformer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            row = ['a', 'b'];
                            transformer = createRowTransformerValidator();
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            transformer.rowValidator = function (r) {
                                throw new Error('Expected error');
                            };
                            return [4 /*yield*/, expect(transformAndValidate(row, transformer)).rejects.toThrow('Expected error')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should resolve with an error if an error is provided to the callback', function () { return __awaiter(void 0, void 0, void 0, function () {
                var row, transformer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            row = ['a', 'b'];
                            transformer = createRowTransformerValidator();
                            transformer.rowValidator = function (r, cb) {
                                setImmediate(function () {
                                    cb(new Error('Expected error'));
                                });
                            };
                            return [4 /*yield*/, expect(transformAndValidate(row, transformer)).rejects.toThrow('Expected error')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
