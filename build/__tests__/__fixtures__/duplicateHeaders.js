"use strict";
exports.__esModule = true;
exports.duplicateHeaders = void 0;
var path_1 = require("path");
var os_1 = require("os");
exports.duplicateHeaders = {
    path: (0, path_1.resolve)(__dirname, 'tmp', 'duplicate_header.csv'),
    content: [
        'first_name,first_name,email_address,address',
        'First1,First1,email1@email.com,"1 Street St, State ST, 88888"',
    ].join(os_1.EOL),
    parsed: []
};
