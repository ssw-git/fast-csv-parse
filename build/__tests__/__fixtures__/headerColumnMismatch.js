"use strict";
exports.__esModule = true;
exports.headerColumnMismatch = void 0;
var path_1 = require("path");
var os_1 = require("os");
exports.headerColumnMismatch = {
    path: (0, path_1.resolve)(__dirname, 'tmp', 'header_column_mismatch.csv'),
    content: [
        'first_name,last_name,email_address,address',
        'First1,Last1,email1@email.com,"1 Street St, State ST, 88888", extra column',
    ].join(os_1.EOL),
    parsed: [
        {
            first_name: 'First1',
            last_name: 'Last1',
            email_address: 'email1@email.com',
            address: '1 Street St, State ST, 88888'
        },
    ]
};
