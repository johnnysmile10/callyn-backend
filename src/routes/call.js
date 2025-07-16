const express = require('express')
const router = express.Router()

const { getCall } = require('../controllers/call')
const authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware, getCall)

module.exports = router