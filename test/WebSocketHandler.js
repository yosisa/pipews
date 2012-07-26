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
        var request;

        beforeEach(function() {
            request = {origin: 'www.example.com'};
            handler = new WebSocketHandler();
        });

        it('should accept when origin is allowed', function() {
            var connection = {on: sinon.spy()};
            var accept = sinon.stub();
            request.accept = accept.returns(connection);
            handler.originIsAllowed = sinon.stub().returns(true);
            handler.onRequest(request);

            expect(accept.called).to.be.ok();
            sinon.assert.calledWithExactly(handler.originIsAllowed, request.origin);
            sinon.assert.calledWithExactly(accept, null, request.origin);

            sinon.assert.calledWithExactly(connection.on, 'message', handler.onMessage);
        });

        it('should reject when origin is not allowd', function() {
            var spy = sinon.spy();
            request.reject = spy;
            handler.originIsAllowed = sinon.stub().returns(false);
            handler.onRequest(request);

            expect(spy.called).to.be.ok();
            sinon.assert.calledWithExactly(handler.originIsAllowed, request.origin);
            sinon.assert.calledWithExactly(spy);
        });
    });

    describe('.onMessage', function() {
        beforeEach(function() {
            handler = new WebSocketHandler();
            handler.stdout = {write: sinon.spy()};
        });

        it('should write received strings to stdout', function() {
            handler.onMessage({type: 'utf8', utf8Data: 'data'});
            sinon.assert.calledWithExactly(handler.stdout.write, 'data\n');
        });

        it('should write received binary data to stdout', function() {
            handler.onMessage({type: 'binary', binaryData: 'data'});
            sinon.assert.calledWithExactly(handler.stdout.write, 'data');
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