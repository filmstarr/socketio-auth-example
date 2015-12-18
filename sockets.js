var socketio = require('socket.io');
var io = null;
var x = 0;

function Sockets() {
}

Sockets.prototype.start = function(server) {
    io = socketio(server);    
    io.on('connection', function(socket) {
            console.log('socket connected');
            socket.on('disconnect', function() {
                console.log('socket disconnected');
            });
        });
    setInterval(emitMessages, 1000);
};

function emitMessages() {
    var message = new Date().toISOString() + ' x = ' + x++;
    //console.log('sending message to sockets: ' + message);
    io.sockets.emit('data', message);
}

module.exports = Sockets;
