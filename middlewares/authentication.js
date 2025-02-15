const { validateToken } = require('../services/authentication');

function checkAUTHENTICATION(CookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[CookieName];

        if (!tokenCookieValue) {
            res.locals.user = null; // Ensure locals.user is null if no token
            return next();
        }

        try {
            const userPayLoad = validateToken(tokenCookieValue);
            req.user = userPayLoad;
            res.locals.user = userPayLoad; // 🔹 Make user available in views
        } catch (e) {
            console.error('Token validation error:', e);
            res.locals.user = null;
        }

        next();
    };
}

module.exports = { checkAUTHENTICATION };
