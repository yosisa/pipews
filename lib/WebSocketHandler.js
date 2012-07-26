'use strict';

var WebSocketHandler = function(server) {
    this.server = server;
};

WebSocketHandler.prototype.onRequest = function(request) {
    if (this.originIsAllowed(request.origin))
        request.accept(null, request.origin);
    else
        request.reject();
};

WebSocketHandler.prototype.originIsAllowed = function(origin) {
    return true;
};

WebSocketHandler.prototype.broadcast = function(data) {
    if (this.server.connections.length > 0)
        this.server.broadcast(data);
};

module.exports = WebSocketHandler;
