"use strict";
exports.__esModule = true;
var src_1 = require("../src");
describe('ParserOptions', function () {
    var createOptions = function (opts) {
        if (opts === void 0) { opts = {}; }
        return new src_1.ParserOptions(opts);
    };
    describe('#objectMode', function () {
        it('should have default objectMode', function () {
            expect(createOptions().objectMode).toBe(true);
        });
        it('should accept a boolean objectMode', function () {
            expect(createOptions({ objectMode: true }).objectMode).toBe(true);
            expect(createOptions({ objectMode: false }).objectMode).toBe(false);
        });
    });
    describe('#delimiter', function () {
        it('should have default delimiter', function () {
            expect(createOptions().delimiter).toBe(',');
        });
        it('should accept a custom delimiter', function () {
            expect(createOptions({ delimiter: '\t' }).delimiter).toBe('\t');
        });
        it('should escape a custom delimiter', function () {
            expect(createOptions({ delimiter: '\\' }).delimiter).toBe('\\');
            expect(createOptions({ delimiter: '\\' }).escapedDelimiter).toBe('\\\\');
        });
    });
    describe('#strictColumnHandling', function () {
        it('should set default strictColumnHandling to false', function () {
            expect(createOptions().strictColumnHandling).toBe(false);
        });
        it('should accept a strictColumnHandling parameter', function () {
            expect(createOptions({ strictColumnHandling: true }).strictColumnHandling).toBe(true);
        });
    });
    describe('#quote', function () {
        it('should set a default quote value', function () {
            expect(createOptions().quote).toBe('"');
        });
        it('should accept an alternate quote', function () {
            expect(createOptions({ quote: '$' }).quote).toBe('$');
        });
    });
    describe('#escapeChar', function () {
        it('should set the escape character to the quote value if not specified', function () {
            expect(createOptions().escapeChar).toBe('"');
        });
        it('should set the escape character to the value if specified', function () {
            expect(createOptions({ quote: '$' }).escapeChar).toBe('$');
        });
        it('should accept an alternate escape', function () {
            expect(createOptions({ escape: '%' }).escapeChar).toBe('%');
        });
    });
    describe('#comment', function () {
        it('should set the comment null if not specified', function () {
            expect(createOptions().comment).toBeNull();
        });
        it('should accept a comment character', function () {
            expect(createOptions({ comment: '#' }).comment).toBe('#');
        });
    });
    describe('#supportsComments', function () {
        it('should set supports comments to false by default', function () {
            expect(createOptions().supportsComments).toBe(false);
        });
        it('should set to true if the comment character is specified', function () {
            expect(createOptions({ comment: '#' }).supportsComments).toBe(true);
        });
    });
    describe('#trim', function () {
        it('should have default trim', function () {
            expect(createOptions().trim).toBe(false);
        });
        it('should accept a boolean objectMode', function () {
            expect(createOptions({ trim: true }).trim).toBe(true);
            expect(createOptions({ trim: false }).trim).toBe(false);
        });
    });
    describe('#ltrim', function () {
        it('should have default ltrim', function () {
            expect(createOptions().ltrim).toBe(false);
        });
        it('should accept a boolean objectMode', function () {
            expect(createOptions({ ltrim: true }).ltrim).toBe(true);
            expect(createOptions({ ltrim: false }).ltrim).toBe(false);
        });
    });
    describe('#rtrim', function () {
        it('should have default rtrim', function () {
            expect(createOptions().rtrim).toBe(false);
        });
        it('should accept a boolean objectMode', function () {
            expect(createOptions({ rtrim: true }).rtrim).toBe(true);
            expect(createOptions({ rtrim: false }).rtrim).toBe(false);
        });
    });
    describe('#discardUnmappedColumns', function () {
        it('should have default discardUnmappedColumns', function () {
            expect(createOptions().discardUnmappedColumns).toBe(false);
        });
        it('should accept a boolean objectMode', function () {
            expect(createOptions({ discardUnmappedColumns: true }).discardUnmappedColumns).toBe(true);
            expect(createOptions({ discardUnmappedColumns: false }).discardUnmappedColumns).toBe(false);
        });
    });
    describe('#headers', function () {
        it('should have default headers', function () {
            expect(createOptions().headers).toBeNull();
        });
        it('should accept an array of headers', function () {
            expect(createOptions({ headers: ['1', '2', '3'] }).headers).toEqual(['1', '2', '3']);
        });
        it('should accept a function', function () {
            var opts = createOptions({ headers: function (headers) { return headers.map(function (h) { return h === null || h === void 0 ? void 0 : h.toLowerCase(); }); } });
            // @ts-ignore
            expect(opts.headers(['A', 'B', 'C'])).toEqual(['a', 'b', 'c']);
        });
        it('should accept headers as a boolean', function () {
            expect(createOptions({ headers: true }).headers).toBe(true);
        });
    });
    describe('#renameHeaders', function () {
        it('should have default renameHeaders', function () {
            expect(createOptions().renameHeaders).toBe(false);
        });
        it('should accept a boolean renameHeaders', function () {
            expect(createOptions({ renameHeaders: true }).renameHeaders).toBe(true);
            expect(createOptions({ renameHeaders: false }).renameHeaders).toBe(false);
        });
    });
    describe('#maxRows', function () {
        it('should default maxRows 0 and limitRows to false', function () {
            var opts = createOptions();
            expect(opts.maxRows).toBe(0);
            expect(opts.limitRows).toBe(false);
        });
        it('should set maxRows to the provided option and limitRows to true if maxRows > 0', function () {
            var opts = createOptions({ maxRows: 1 });
            expect(opts.maxRows).toBe(1);
            expect(opts.limitRows).toBe(true);
        });
        it('should set maxRows to the provided option and limitRows to true if maxRows === 0', function () {
            var opts = createOptions({ maxRows: 0 });
            expect(opts.maxRows).toBe(0);
            expect(opts.limitRows).toBe(false);
        });
    });
    describe('#skipLines', function () {
        it('should default skipLines to 0', function () {
            var opts = createOptions();
            expect(opts.skipLines).toBe(0);
        });
        it('should set skipLines to the user provided option', function () {
            var opts = createOptions({ skipLines: 10 });
            expect(opts.skipLines).toBe(10);
        });
    });
    describe('#skipRows', function () {
        it('should default skipLines to 0', function () {
            var opts = createOptions();
            expect(opts.skipRows).toBe(0);
        });
        it('should set skipLines to the user provided option', function () {
            var opts = createOptions({ skipRows: 10 });
            expect(opts.skipRows).toBe(10);
        });
    });
});
