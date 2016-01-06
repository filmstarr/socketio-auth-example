var socketio = require('socket.io');
var socketAuth = require('socketio-auth');
var io = null;
var security = null;

function Sockets() {
}

Sockets.prototype.start = function(server, securityParam) {
    console.log('starting sockets');
    security = securityParam;
    io = socketio(server);
    
    // set up the socket authorisation round-trip
    socketAuth(io, {
        authenticate: authenticate,
        timeout: 5 * 1000, // how long to wait for an authorisation token to be sent
    });
    
    // set up a message pump to simulate socket usage
    setInterval(emitMessages, 1000);
};

Sockets.prototype.sockets = function() {
    return io.sockets.connected;
};

var x = 0;
function emitMessages() {
    var message = new Date().toISOString() + ' x = ' + x++;
    io.sockets.emit('data', message);
}

function authenticate(socket, token, callback) {
    security.getSessionID(token, function(err, decoded) {
        if (err) return callback('Could not decode token: ' + err);
        console.log('socket connected with sessionID: ' + decoded.sessionID);
        security.getSession(decoded.sessionID, function(err, session) {
            // check if the session is valid and logged in
            if (err) return notAuthenticated(callback, 'getSession failed: ' + err);
            if (session == null) return notAuthenticated(callback, 'Could not find session');
            if (session.passport == null || session.passport.user == null) return notAuthenticated(callback, 'User not logged in');
            
            // if we get this far then everything looks good. attach the session id and object to the socket
            console.log('socket authorised');
            socket.sessionID = decoded.sessionID;
            socket.session = session;
            callback(null, true);
        });
    });
}

function notAuthenticated(callback, message) {
    console.log('socket unauthorised: ' + message);
    callback(new Error(message));
}

module.exports = Sockets;
