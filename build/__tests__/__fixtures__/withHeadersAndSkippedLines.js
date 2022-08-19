"use strict";
exports.__esModule = true;
exports.withHeadersAndSkippedLines = void 0;
var path_1 = require("path");
var os_1 = require("os");
exports.withHeadersAndSkippedLines = {
    path: (0, path_1.resolve)(__dirname, 'tmp', 'with_headers_skip_lines.csv'),
    content: [
        'skip_one_first_name,skip_one_last_name,skip_one_email_address',
        'skip_two_first_name,skip_two_last_name,skip_two_email_address',
        'first_name,last_name,email_address',
        'First1,Last1,email1@email.com',
        'First2,Last2,email2@email.com',
        'First3,Last3,email3@email.com',
        'First4,Last4,email4@email.com',
        'First5,Last5,email5@email.com',
        'First6,Last6,email6@email.com',
        'First7,Last7,email7@email.com',
        'First8,Last8,email8@email.com',
        'First9,Last9,email9@email.com',
    ].join(os_1.EOL),
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
        {
            first_name: 'First4',
            last_name: 'Last4',
            email_address: 'email4@email.com'
        },
        {
            first_name: 'First5',
            last_name: 'Last5',
            email_address: 'email5@email.com'
        },
        {
            first_name: 'First6',
            last_name: 'Last6',
            email_address: 'email6@email.com'
        },
        {
            first_name: 'First7',
            last_name: 'Last7',
            email_address: 'email7@email.com'
        },
        {
            first_name: 'First8',
            last_name: 'Last8',
            email_address: 'email8@email.com'
        },
        {
            first_name: 'First9',
            last_name: 'Last9',
            email_address: 'email9@email.com'
        },
    ]
};
