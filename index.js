var path = require('path');
var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

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

// routes
app.get('/', function(req, res) { res.render('index') });

// set up the server
http.createServer(app).listen(3001, function() {
    console.log('listening on http://localhost:3001/');
});
