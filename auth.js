var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var users = new (require('./users'))();
var security = null;

function Auth() {
}

Auth.prototype.setup = function(app, securityParam) {
    console.log('setting up passport');
    security = securityParam;
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        users.findById(id, function (err, user) {
            done(err, user);
        });
    });
    
    passport.use(new localStrategy(
        function(username, password, done) {
            process.nextTick(function () {
                users.findByUsername(username, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user || user.password != password) {
                        return done(null, false, { message: 'Unrecognised credentials' });
                    }
                    return done(null, user);
                })
            });
        }
    ));

    app.use(passport.initialize());
    app.use(passport.session());
}

Auth.prototype.login = function() {
    return passport.authenticate('local', { failureRedirect: '/login', failureFlash: true });
}

Auth.prototype.logout = function() {
    return function(req, res) {
        req.logout();
        security.disconnect(req.sessionID);
        res.redirect('/');
    }
}

Auth.prototype.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = Auth;
