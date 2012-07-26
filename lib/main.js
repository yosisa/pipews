'use strict';

var websocket = require('websocket');
var http = require('http');
var _ = require('underscore');
var WebSocketHandler = require('./WebSocketHandler');
var stdio = require('./stdio');

function startServer(port) {
    var httpServer = http.createServer(function(request, response) {
        response.writeHead(404);
        response.end();
    });
    httpServer.listen(port, function() {});

    var wsServer = new websocket.server({
        httpServer: httpServer,
        autoAcceptConnections: false
    });
    var wsHandler = new WebSocketHandler(wsServer);
    _.bindAll(wsHandler);
    wsServer.on('request', wsHandler.onRequest);
    return wsHandler;
}

function main(port) {
    var wsHandler = startServer(port);
    stdio.captureInput(wsHandler.broadcast);
};

module.exports = {
    startServer: startServer,
    main: main
};
