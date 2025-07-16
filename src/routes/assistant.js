const express = require('express')
const router = express.Router()

const { createFirstAssistant, getAssistant } = require('../controllers/assistant')
const authMiddleware = require('../middlewares/auth')

router.post('/first-agent', authMiddleware, createFirstAssistant)
router.get('/', authMiddleware, getAssistant)

module.exports = router