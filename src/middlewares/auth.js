const db = require('../db/sqlite')
const jwt = require('jsonwebtoken')

async function authMiddleware(req, res, next) {
    const token = req.headers['authorization'] || ''
    const bearerToken = token.slice(`Bearer `.length);

    if (!bearerToken) {
        return res.status(401).send('Not authorized!');
    }

    try {
        const authUser = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY)
        const query = "SELECT * FROM users WHERE id = ?"
        db.all(query, [authUser.user_id], (err, rows) => {
            if (err) throw err;
            if (rows && rows.length > 0) {
                const user = rows[0]
                req.user = { user_id: user.id, email: user.email };
                next();
            } else {
                res.status(401).send('Not authorized');
            }
        });
    } catch (err) {
        res.status(401).send('Not authorized');
    }
}

module.exports = authMiddleware