'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var stdio = require('../lib/stdio');

describe('stdio', function() {
    describe('.setupInput', function() {
        var mock;

        afterEach(function() {
            if (mock) {
                mock.verify();
                mock.restore();
            }
        });

        it('should setup stdin', function() {
            mock = sinon.mock(process.stdin);
            var callback = function() {};

            mock.expects('resume').once();
            mock.expects('setEncoding').once().withArgs('utf8');
            mock.expects('on').once().withArgs('data', callback);
            stdio.captureInput(callback);
        });
    });
});