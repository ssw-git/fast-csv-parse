"use strict";
exports.__esModule = true;
exports.ParserOptions = void 0;
var lodash_escaperegexp_1 = require("lodash.escaperegexp");
var lodash_isnil_1 = require("lodash.isnil");
var ParserOptions = /** @class */ (function () {
    function ParserOptions(opts) {
        var _a;
        this.objectMode = true;
        this.delimiter = ',';
        this.ignoreEmpty = false;
        this.quote = '"';
        this.escape = null;
        this.escapeChar = this.quote;
        this.comment = null;
        this.supportsComments = false;
        this.ltrim = false;
        this.rtrim = false;
        this.trim = false;
        this.headers = null;
        this.renameHeaders = false;
        this.strictColumnHandling = false;
        this.discardUnmappedColumns = false;
        this.carriageReturn = '\r';
        this.encoding = 'utf8';
        this.limitRows = false;
        this.maxRows = 0;
        this.skipLines = 0;
        this.skipRows = 0;
        Object.assign(this, opts || {});
        if (this.delimiter.length > 1) {
            throw new Error('delimiter option must be one character long');
        }
        this.escapedDelimiter = (0, lodash_escaperegexp_1["default"])(this.delimiter);
        this.escapeChar = (_a = this.escape) !== null && _a !== void 0 ? _a : this.quote;
        this.supportsComments = !(0, lodash_isnil_1["default"])(this.comment);
        this.NEXT_TOKEN_REGEXP = new RegExp("([^\\s]|\\r\\n|\\n|\\r|".concat(this.escapedDelimiter, ")"));
        if (this.maxRows > 0) {
            this.limitRows = true;
        }
    }
    return ParserOptions;
}());
exports.ParserOptions = ParserOptions;
