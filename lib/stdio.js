'use strict';

module.exports = {
    captureInput: function (callback) {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', callback);
    }
};
