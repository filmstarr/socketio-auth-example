var socketio = require('socket.io');
var _ = require('lodash');
var socketAuth = require('./socketio-auth');

var io = null;
var ioHomeNamespace = null;
var ioTestNamespace = null;

function Sockets() {
}

Sockets.prototype.start = function(server, security) {    
    // set up the socket.io server
    console.log('starting socket server');
    io = socketio(server);
    ioHomeNamespace = io.of('/home');
    ioTestNamespace = io.of('/test');
    socketAuth(io, {
        authenticate: security.authenticateSocket,
        postAuthenticate: security.postAuthenticateSocket,
        timeout: 5 * 1000, // how long to wait for an authorisation token to be sent
    });
    
    // set up incoming connection data handlers
    ioHomeNamespace.on('connection', setupSocketHandler);
    ioTestNamespace.on('connection', setupSocketHandler);
    
    // set up a message pump to simulate socket usage
    setInterval(emitMessages, 500);
};

// test outbound messages
var x = 0;
function emitMessages() {
    var message = new Date().toISOString() + ' x = ' + x++;
    ioHomeNamespace.emit('data', 'HOME NAMESPACE: ' + message);
    ioTestNamespace.emit('data', 'TEST NAMESPACE: ' + message);
}

// test incoming messages
function setupSocketHandler(socket) {
    socket.on('test', function(data) {
        if (!socket.auth) {
            // ignore data
            return;
        }
        //console.log('RECEIVED CLIENT DATA: ' + socket.nsp.name + ' => ' + data);
    });
}

Sockets.prototype.connectedSockets = function() {
    var connectedSockets = [];
    _.each(io.nsps, function(nsp) {
        _.each(nsp.sockets, function(socket) {
            connectedSockets.push(socket);
        });
    });
    return connectedSockets;
};

module.exports = Sockets;
