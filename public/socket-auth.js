log('connecting to socket');
var socket = io.connect(':3001' + (window.location.pathname == '/restricted' ? '/test' : '/home'));

var id = 0;

socket
    .on('connect', function() {
        log('socket connected');
        if (id == 0) {
            setInterval(function() {
                // send messages back to the server to ensure we can detect that they're unauthenticated
                socket.emit('test', 'test' + ++id);
            }, 400);
        }
        setTimeout(function() {
            log('sending auth token');
            //socket.emit('foo', 'bar');
            socket.emit('authentication', token);
        }, 2000);
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

