var path = require('path');
var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var auth = new (require('./auth'))();
var routes = new (require('./routes'))();
var sockets = new (require('./sockets'))();

// set up the main app
var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'test hash 123!',
    resave: false,
    saveUninitialized: false, // this stops a session being written until logged in
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

auth.setup(app);

// routes
app.get('/', routes.index());
app.get('/restricted', auth.ensureAuthenticated, routes.restricted());
app.post('/login', auth.login(), routes.redirect('/'));
app.get('/logout', auth.logout());

// set up the server
var server = http.createServer(app);
server.listen(3001, function() {
    console.log('listening on http://localhost:3001/');
    console.log('starting sockets');
    sockets.start(server);
});
