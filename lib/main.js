'use strict';

var websocket = require('websocket');
var http = require('http');
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
    wsServer.on('request', wsHandler.onRequest.bind(wsHandler));
    return wsHandler;
}

function main(port, options) {
    options = options || {};
    var wsHandler = startServer(port);
    if (!options.disableInput)
        stdio.captureInput(wsHandler.broadcast.bind(wsHandler));
};

module.exports = {
    startServer: startServer,
    main: main
};
