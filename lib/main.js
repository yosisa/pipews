'use strict';

var websocket = require('websocket');
var http = require('http');
var WebSocketHandler = require('./WebSocketHandler');
var stdio = require('./stdio');

function makeServer(wsHandler) {
    var httpServer = http.createServer(function(request, response) {
        response.writeHead(404);
        response.end();
    });

    var wsServer = new websocket.server({
        httpServer: httpServer,
        autoAcceptConnections: false
    });
    wsHandler.server = wsServer;
    wsServer.on('request', wsHandler.onRequest.bind(wsHandler));

    return httpServer;
}

function main(port, options) {
    options = options || {};

    var wsHandler = new WebSocketHandler();
    if (!options.disableInput)
        stdio.captureInput(wsHandler.broadcast.bind(wsHandler));
    if (options.disableOutput)
        wsHandler.stdout = null;

    var httpServer = makeServer(wsHandler);
    httpServer.listen(port, function() {});
};

module.exports = {
    makeServer: makeServer,
    main: main
};
