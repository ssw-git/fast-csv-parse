"use strict";
exports.__esModule = true;
exports.ColumnFormatter = void 0;
var ColumnFormatter = /** @class */ (function () {
    function ColumnFormatter(parserOptions) {
        if (parserOptions.trim) {
            this.format = function (col) { return col.trim(); };
        }
        else if (parserOptions.ltrim) {
            this.format = function (col) { return col.trimLeft(); };
        }
        else if (parserOptions.rtrim) {
            this.format = function (col) { return col.trimRight(); };
        }
        else {
            this.format = function (col) { return col; };
        }
    }
    return ColumnFormatter;
}());
exports.ColumnFormatter = ColumnFormatter;
