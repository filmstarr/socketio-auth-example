var users = [
    { id: 1, username: 'scott', password: 'pass' }
];

function Users() {
}

Users.prototype.findById = function(id, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.id === id) {
            return fn(null, user);
        }
    }
    fn(new Error('User ' + id + ' does not exist'));
}

Users.prototype.findByUsername = function(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

module.exports = Users;
