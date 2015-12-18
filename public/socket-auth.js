


log('connecting to socket');
var socket = io.connect('localhost:3001/');

socket
    .on('connect', function() {
        log('socket connected');
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
    .on('data', function(message) {
        log(message);
    });
    
function log(message) {
    //console.log('MESSAGE: ' + message);
    document.getElementById('socketStatus').innerHTML = message;
}

