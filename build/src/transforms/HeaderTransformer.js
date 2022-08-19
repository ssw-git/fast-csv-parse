"use strict";
exports.__esModule = true;
exports.HeaderTransformer = void 0;
var lodash_isundefined_1 = require("lodash.isundefined");
var lodash_isfunction_1 = require("lodash.isfunction");
var lodash_uniq_1 = require("lodash.uniq");
var lodash_groupby_1 = require("lodash.groupby");
var HeaderTransformer = /** @class */ (function () {
    function HeaderTransformer(parserOptions) {
        this.headers = null;
        this.receivedHeaders = false;
        this.shouldUseFirstRow = false;
        this.processedFirstRow = false;
        this.headersLength = 0;
        this.parserOptions = parserOptions;
        if (parserOptions.headers === true) {
            this.shouldUseFirstRow = true;
        }
        else if (Array.isArray(parserOptions.headers)) {
            this.setHeaders(parserOptions.headers);
        }
        else if ((0, lodash_isfunction_1["default"])(parserOptions.headers)) {
            this.headersTransform = parserOptions.headers;
        }
    }
    HeaderTransformer.prototype.transform = function (row, cb) {
        if (!this.shouldMapRow(row)) {
            return cb(null, { row: null, isValid: true });
        }
        return cb(null, this.processRow(row));
    };
    HeaderTransformer.prototype.shouldMapRow = function (row) {
        var parserOptions = this.parserOptions;
        if (!this.headersTransform && parserOptions.renameHeaders && !this.processedFirstRow) {
            if (!this.receivedHeaders) {
                throw new Error('Error renaming headers: new headers must be provided in an array');
            }
            this.processedFirstRow = true;
            return false;
        }
        if (!this.receivedHeaders && Array.isArray(row)) {
            if (this.headersTransform) {
                this.setHeaders(this.headersTransform(row));
            }
            else if (this.shouldUseFirstRow) {
                this.setHeaders(row);
            }
            else {
                // dont do anything with the headers if we didnt receive a transform or shouldnt use the first row.
                return true;
            }
            return false;
        }
        return true;
    };
    HeaderTransformer.prototype.processRow = function (row) {
        if (!this.headers) {
            return { row: row, isValid: true };
        }
        var parserOptions = this.parserOptions;
        if (!parserOptions.discardUnmappedColumns && row.length > this.headersLength) {
            if (!parserOptions.strictColumnHandling) {
                throw new Error("Unexpected Error: column header mismatch expected: ".concat(this.headersLength, " columns got: ").concat(row.length));
            }
            return {
                row: row,
                isValid: false,
                reason: "Column header mismatch expected: ".concat(this.headersLength, " columns got: ").concat(row.length)
            };
        }
        if (parserOptions.strictColumnHandling && row.length < this.headersLength) {
            return {
                row: row,
                isValid: false,
                reason: "Column header mismatch expected: ".concat(this.headersLength, " columns got: ").concat(row.length)
            };
        }
        return { row: this.mapHeaders(row), isValid: true };
    };
    HeaderTransformer.prototype.mapHeaders = function (row) {
        var rowMap = {};
        var _a = this, headers = _a.headers, headersLength = _a.headersLength;
        for (var i = 0; i < headersLength; i += 1) {
            var header = headers[i];
            if (!(0, lodash_isundefined_1["default"])(header)) {
                var val = row[i];
                // eslint-disable-next-line no-param-reassign
                if ((0, lodash_isundefined_1["default"])(val)) {
                    rowMap[header] = '';
                }
                else {
                    rowMap[header] = val;
                }
            }
        }
        return rowMap;
    };
    HeaderTransformer.prototype.setHeaders = function (headers) {
        var _a;
        var filteredHeaders = headers.filter(function (h) { return !!h; });
        if ((0, lodash_uniq_1["default"])(filteredHeaders).length !== filteredHeaders.length) {
            var grouped_1 = (0, lodash_groupby_1["default"])(filteredHeaders);
            var duplicates = Object.keys(grouped_1).filter(function (dup) { return grouped_1[dup].length > 1; });
            throw new Error("Duplicate headers found ".concat(JSON.stringify(duplicates)));
        }
        this.headers = headers;
        this.receivedHeaders = true;
        this.headersLength = ((_a = this.headers) === null || _a === void 0 ? void 0 : _a.length) || 0;
    };
    return HeaderTransformer;
}());
exports.HeaderTransformer = HeaderTransformer;
