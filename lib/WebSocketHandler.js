'use strict';

var WebSocketHandler = function(server) {
    this.server = server;
    this.stdout = process.stdout;
};

WebSocketHandler.prototype.onRequest = function(request) {
    if (!this.originIsAllowed(request.origin)) {
        request.reject();
        return;
    }
    var connection = request.accept(null, request.origin);
    connection.on('message', this.onMessage.bind(this));
};

WebSocketHandler.prototype.onMessage = function(message) {
    if (message.type == 'utf8')
        this.stdout.write(message.utf8Data + '\n');
    else if (message.type == 'binary')
        this.stdout.write(message.binaryData);
};

WebSocketHandler.prototype.originIsAllowed = function(origin) {
    return true;
};

WebSocketHandler.prototype.broadcast = function(data) {
    if (this.server.connections.length > 0)
        this.server.broadcast(data);
};

module.exports = WebSocketHandler;
