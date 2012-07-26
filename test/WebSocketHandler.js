'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var WebSocketHandler = require('../lib/WebSocketHandler');

describe('WebSocketHandler', function() {
    var handler;

    describe('.originIsAllowed', function() {
        it('should always ok', function() {
            handler = new WebSocketHandler();
            expect(handler.originIsAllowed('')).to.be.ok();
            expect(handler.originIsAllowed('www.example.jp')).to.be.ok();
            expect(handler.originIsAllowed(undefined)).to.be.ok();
        });
    });

    describe('.onRequest', function() {
        var spy, request;

        beforeEach(function() {
            spy = sinon.spy();
            request = {origin: 'www.example.com'};
            handler = new WebSocketHandler();
        });

        it('should accept when origin is allowed', function() {
            request.accept = spy;
            handler.originIsAllowed = sinon.stub().returns(true);
            handler.onRequest(request);

            expect(spy.called).to.be.ok();
            sinon.assert.calledWithExactly(handler.originIsAllowed, request.origin);
            sinon.assert.calledWithExactly(spy, null, request.origin);
        });

        it('should reject when origin is not allowd', function() {
            request.reject = spy;
            handler.originIsAllowed = sinon.stub().returns(false);
            handler.onRequest(request);

            expect(spy.called).to.be.ok();
            sinon.assert.calledWithExactly(handler.originIsAllowed, request.origin);
            sinon.assert.calledWithExactly(spy);
        });
    });

    describe('.broadcast', function() {
        var server;

        beforeEach(function() {
            server = {broadcast: sinon.spy(), connections: []};
            handler = new WebSocketHandler(server);
        });

        it('should not send data when no connection available', function() {
            handler.broadcast('data');
            sinon.assert.notCalled(server.broadcast);
        });

        it('should send data when at least one connection available', function() {
            server.connections.push(sinon.spy());
            handler.broadcast('data');
            sinon.assert.calledWithExactly(server.broadcast, 'data');
        });
    });
});