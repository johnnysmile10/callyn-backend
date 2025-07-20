const express = require('express')
const router = express.Router()

const { getCall, createCall } = require('../controllers/call')
const authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware, getCall)
router.post('/:contact_id', authMiddleware, createCall)

module.exports = router