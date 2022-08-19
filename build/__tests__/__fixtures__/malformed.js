"use strict";
exports.__esModule = true;
exports.malformed = void 0;
var path_1 = require("path");
var os_1 = require("os");
exports.malformed = {
    path: (0, path_1.resolve)(__dirname, 'tmp', 'malformed.csv'),
    content: [
        'first_name,last_name,email_address,address',
        '"First1"a   ", Last1 ,email1@email.com,"1 Street St, State ST, 88888"',
        'First2,Last2,email2@email.com,"2 Street St, State ST, 88888"',
    ].join(os_1.EOL),
    parsed: []
};
