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
    getSessionID(token, callback);
}

Security.prototype.getSession = function(sessionID, callback) {
    getSession(sessionID, callback);
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
    setInterval(checkForUnauthorisedSockets, 4 * 1000);
}

Security.prototype.authenticateSocket = function(socket, token, callback) {
    getSessionID(token, function(err, decoded) {
        if (err) return callback('Could not decode token: ' + err);
        console.log('socket connected with sessionID: ' + decoded.sessionID);
        getSession(decoded.sessionID, function(err, session) {
            // check if the session is valid and logged in
            if (err) return callback('getSession failed: ' + err);
            if (session == null) return callback('Could not find session');
            if (session.passport == null || session.passport.user == null) return callback('User not logged in');
            console.log('socket authorised');
            
            // don't set the socket session id here as it will need applying to multiple sockets
            callback(null, true);
        });
    });
}

Security.prototype.postAuthenticateSocket = function(socket, token) {
    getSessionID(token, function(err, decoded) {
        if (err) {
            return socket.disconnect();
        }
        socket.sessionID = decoded.sessionID;
    });
};

function getSessionID(token, callback) {
    jwt.verify(token, secret, callback);
}

function getSession(sessionID, callback) {
    sessionStore.get(sessionID, callback);
}

function checkForUnauthorisedSockets() {
    console.log('checking for unauthorised sockets');
    var connectedSockets = sockets.connectedSockets();
    connectedSockets.forEach(function (socket) {
        checkIfSocketIsUnauthorised(socket);
    });
}

function checkIfSocketIsUnauthorised(socket) {
    if (socket.sessionID == null) {
        // socket is probably still in the authentication process
        return;
    }
    
    // ensure sessionID is valid and logged in
    sessionStore.get(socket.sessionID, function(err, session) {
        if (err) return disconnectSocket(socket, 'Problem getting session: ' + err);
        if (session == null) return disconnectSocket(socket, 'Session could not be found (probably expired): ' + socket.sessionID);
        if (session.passport == null || session.passport.user == null) return disconnectSocket('User is not logged in');
        console.log('socket is authorised with sessionID: ' + socket.sessionID);
    });
}

function disconnectSocket(socket, reason) {
    socket.emit('unauthorized', reason);
    socket.disconnect();
}

module.exports = Security;
