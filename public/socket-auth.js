


log('connecting to socket');
var socket = io.connect('localhost:3001/');

socket
    .on('connect', function() {
        log('socket connected, sending auth token');
        socket.emit('authentication', token);
    })
    .on('connect_error', function(err) {
        log('socket connect error: ' + err);
    })
    .on('connect_timeout', function() {
        log('socket connect timed out');
    })
    .on('reconnect', function(number) {
        log('socket reconnected: attempt number: ' + number);
    })
    .on('reconnecting', function(number) {
        log('socket reconnecting: attempt number: ' + number);
    })
    .on('reconnectPattempt', function() {
        log('socket reconnect attempt');
    })
    .on('reconnect_error', function(err) {
        log('socket reconnect error: ' + err);
    })
    .on('reconnect_failed', function(err) {
        log('socket reconnect failed');
    })
    .on('authenticated', function(message) {
        log('socket authenticated: ' + message);
    })
    .on('unauthorized', function(message) {
        log('socket unauthorised, redirecting: ' + message);
        window.location = '/login';
    })
    .on('disconnect', function() {
        log('socket disconnect');
    })
    .on('data', function(message) {
        log(message);
    });
    
function log(message) {
    console.log('MESSAGE: ' + message);
    document.getElementById('socketStatus').innerHTML = message;
}

