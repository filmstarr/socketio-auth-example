
function Routes() {
}

Routes.prototype.redirect = function(url) {
    return function(req, res) {
        res.redirect(url);
    }
}

Routes.prototype.index = function() {
    return function(req, res) {
        res.render('index', {
            user: req.user,
            message: req.flash('error')
        });
    };
}

Routes.prototype.restricted = function() {
    return function(req, res) {
        res.render('restricted');
    };
}

module.exports = Routes;
