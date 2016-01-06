
var tokens = null;

function Routes(tokensParam) {
    tokens = tokensParam;
}

Routes.prototype.redirect = function(url) {
    return function(req, res) {
        res.redirect(url);
    }
}

Routes.prototype.index = function() {
    return function(req, res) {
        // token is required for socket connection authentication
        res.render('index', {
            user: req.user,
            message: req.flash('error'),
            token: tokens.getToken(req.sessionID),
        });
    };
}

Routes.prototype.login = function() {
    return function(req, res) {
        res.render('login', {
            user: req.user,
        });
    };
}

Routes.prototype.restricted = function() {
    return function(req, res) {
        // token is required for socket connection authentication
        res.render('restricted', {
            user: req.user,
            token: tokens.getToken(req.sessionID),
        });
    };
}

module.exports = Routes;
