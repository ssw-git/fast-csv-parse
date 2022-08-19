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
exports.RecordingStream = void 0;
var stream_1 = require("stream");
var RecordingStream = /** @class */ (function (_super) {
    __extends(RecordingStream, _super);
    function RecordingStream() {
        var _this = _super.call(this, {
            write: function (data, enc, cb) {
                _this.data.push(data.toString());
                cb();
            }
        }) || this;
        _this.data = [];
        return _this;
    }
    return RecordingStream;
}(stream_1.Writable));
exports.RecordingStream = RecordingStream;
