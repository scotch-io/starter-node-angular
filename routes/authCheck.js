/*
This is back-end authorization; it can be used to protect individual routes
from being hit either directly or through the front end. We'd want to
check the user's login status on the front end, too, possibly to hide
parts of the interface from unauthenticated users.
 */

const checkAuthorization = function (req, res, next) {
    if (!req.isAuthenticated())
        res.sendStatus(401)
    else next()
}

module.exports = checkAuthorization