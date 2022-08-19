"use strict";
exports.__esModule = true;
exports.isSyncValidate = exports.isSyncTransform = void 0;
var isSyncTransform = function (transform) { return transform.length === 1; };
exports.isSyncTransform = isSyncTransform;
var isSyncValidate = function (validate) {
    return validate.length === 1;
};
exports.isSyncValidate = isSyncValidate;
