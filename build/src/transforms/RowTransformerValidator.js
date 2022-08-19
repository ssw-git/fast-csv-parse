"use strict";
exports.__esModule = true;
exports.RowTransformerValidator = void 0;
var lodash_isfunction_1 = require("lodash.isfunction");
var types_1 = require("../types");
var RowTransformerValidator = /** @class */ (function () {
    function RowTransformerValidator() {
        this._rowTransform = null;
        this._rowValidator = null;
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    RowTransformerValidator.createTransform = function (transformFunction) {
        if ((0, types_1.isSyncTransform)(transformFunction)) {
            return function (row, cb) {
                var transformed = null;
                try {
                    transformed = transformFunction(row);
                }
                catch (e) {
                    return cb(e);
                }
                return cb(null, transformed);
            };
        }
        return transformFunction;
    };
    RowTransformerValidator.createValidator = function (validateFunction) {
        if ((0, types_1.isSyncValidate)(validateFunction)) {
            return function (row, cb) {
                cb(null, { row: row, isValid: validateFunction(row) });
            };
        }
        return function (row, cb) {
            validateFunction(row, function (err, isValid, reason) {
                if (err) {
                    return cb(err);
                }
                if (isValid) {
                    return cb(null, { row: row, isValid: isValid, reason: reason });
                }
                return cb(null, { row: row, isValid: false, reason: reason });
            });
        };
    };
    Object.defineProperty(RowTransformerValidator.prototype, "rowTransform", {
        set: function (transformFunction) {
            if (!(0, lodash_isfunction_1["default"])(transformFunction)) {
                throw new TypeError('The transform should be a function');
            }
            this._rowTransform = RowTransformerValidator.createTransform(transformFunction);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowTransformerValidator.prototype, "rowValidator", {
        set: function (validateFunction) {
            if (!(0, lodash_isfunction_1["default"])(validateFunction)) {
                throw new TypeError('The validate should be a function');
            }
            this._rowValidator = RowTransformerValidator.createValidator(validateFunction);
        },
        enumerable: false,
        configurable: true
    });
    RowTransformerValidator.prototype.transformAndValidate = function (row, cb) {
        var _this = this;
        return this.callTransformer(row, function (transformErr, transformedRow) {
            if (transformErr) {
                return cb(transformErr);
            }
            if (!transformedRow) {
                return cb(null, { row: null, isValid: true });
            }
            return _this.callValidator(transformedRow, function (validateErr, validationResult) {
                if (validateErr) {
                    return cb(validateErr);
                }
                if (validationResult && !validationResult.isValid) {
                    return cb(null, { row: transformedRow, isValid: false, reason: validationResult.reason });
                }
                return cb(null, { row: transformedRow, isValid: true });
            });
        });
    };
    RowTransformerValidator.prototype.callTransformer = function (row, cb) {
        if (!this._rowTransform) {
            return cb(null, row);
        }
        return this._rowTransform(row, cb);
    };
    RowTransformerValidator.prototype.callValidator = function (row, cb) {
        if (!this._rowValidator) {
            return cb(null, { row: row, isValid: true });
        }
        return this._rowValidator(row, cb);
    };
    return RowTransformerValidator;
}());
exports.RowTransformerValidator = RowTransformerValidator;
