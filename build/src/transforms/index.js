"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.HeaderTransformer = exports.RowTransformerValidator = void 0;
var RowTransformerValidator_1 = require("./RowTransformerValidator");
__createBinding(exports, RowTransformerValidator_1, "RowTransformerValidator");
var HeaderTransformer_1 = require("./HeaderTransformer");
__createBinding(exports, HeaderTransformer_1, "HeaderTransformer");