const { v4: uuid } = require('uuid')
const jwt = require('jsonwebtoken')

const db = require('../db/sqlite')

/**
 * Login function
 */
async function login(req, res) {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    db.all(query, [email], (err, rows) => {
        if (err) {
            return res.json({ status: 500, message: "DB error!" })
        }
        if (rows.length > 0 && rows[0].password === password) {
            const token = jwt.sign({ user_id: rows[0].id }, process.env.JWT_SECRET_KEY);
            return res.json({ status: 200, message: 'Login success!', token })
        }
        return res.json({ status: 400, message: 'Email or password incorrect!' })
    })
}

/**
 * Register function
 */
async function register(req, res) {
    const { email, password } = req.body;

    try {
        const checkQuery = 'SELECT * FROM users WHERE email = ?';
        db.all(checkQuery, [email], (err, checkRows) => {
            if (err) throw err;
            if (checkRows && checkRows.length > 0) {
                return res.json({ status: 400, message: 'Email already exists.' });

            }

            const addQuery = `INSERT INTO users (id, email, password) VALUES (?, ?, ?)`;
            db.all(addQuery, [uuid(), email, password], (err) => {
                if (err) throw err;
                return res.json({ status: 200, message: 'Register success!' })
            });
        });
    } catch (err) {
        return res.json({ status: 500, message: 'Server error!' });
    }
}

/**
 * Get me
 */
async function getMe(req, res) {
    const user = req.user;
    res.json({
        status: 200, user: {
            id: user.id,
            email: user.email
        }
    })
}

module.exports = {
    login,
    register,
    getMe
}