"use strict";
exports.__esModule = true;
exports.alternateEncoding = void 0;
var path_1 = require("path");
var os_1 = require("os");
exports.alternateEncoding = {
    path: (0, path_1.resolve)(__dirname, 'tmp', 'alternate_encoding.csv'),
    content: Buffer.from([
        'first_name,last_name,email_address',
        'First1,Last1,email1@email.com',
        'First2,Last2,email2@email.com',
        'First3,Last3,email3@email.com',
    ].join(os_1.EOL), 'utf16le'),
    parsed: [
        {
            first_name: 'First1',
            last_name: 'Last1',
            email_address: 'email1@email.com'
        },
        {
            first_name: 'First2',
            last_name: 'Last2',
            email_address: 'email2@email.com'
        },
        {
            first_name: 'First3',
            last_name: 'Last3',
            email_address: 'email3@email.com'
        },
    ]
};
