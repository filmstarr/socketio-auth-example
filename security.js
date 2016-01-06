var jwt = require('jsonwebtoken');
var secret = 'NoWmegR11kJSiur13tybjrYKZIrwx8oF';
var sockets = null;
var sessionStore = null;

function Security() {
}

Security.prototype.getToken = function(sessionID) {
    return jwt.sign({
        sessionID: sessionID,
    }, secret);
}

Security.prototype.getSessionID = function(token, callback) {
    jwt.verify(token, secret, callback);
}

Security.prototype.getSession = function(sessionID, callback) {
    sessionStore.get(sessionID, callback);
}

Security.prototype.disconnect = function(sessionID) {
    // loop through sockets with this sessionID and disconnect them
    console.log('disconnecting all sockets for sessionID: ' + sessionID);
    var connectedSockets = sockets.sockets();
    for (var socketId in connectedSockets) {
        var socket = connectedSockets[socketId];
        if (socket.sessionID != null && socket.sessionID == sessionID) {
            disconnectSocket(socket, 'User logout');
        }
    }
}

Security.prototype.start = function(socketsParam, sessionStoreParam) {
    // start timers to check for any sockets we should disconnect
    console.log('starting security');
    sockets = socketsParam;
    sessionStore = sessionStoreParam;
    setInterval(checkForUnauthorisedSockets, 5 * 1000);
}

function checkForUnauthorisedSockets() {
    console.log('checking for unauthorised sockets');
    var connectedSockets = sockets.sockets();
    for (var socketId in connectedSockets) {
        checkIfSocketIsUnauthorised(connectedSockets[socketId]);
    }
}

function checkIfSocketIsUnauthorised(socket) {
    if (socket.sessionID == null) {
        // socket is probably still in the authorisation process
        return;
    }
    
    // ensure sessionID is valid and logged in
    sessionStore.get(socket.sessionID, function(err, session) {
        if (err) return disconnectSocket(socket, 'Problem getting session: ' + err);
        if (session == null) return disconnectSocket(socket, 'Session could not be found (probably expired): ' + socket.sessionID);
        if (session.passport == null || session.passport.user == null) return disconnectSocket('User is not logged in');
        console.log('socket is good with session: ' + socket.sessionID);
    });
}

function disconnectSocket(socket, reason) {
    socket.emit('unauthorized', reason);
    socket.disconnect();
}

module.exports = Security;
