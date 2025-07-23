const express = require('express')
const router = express.Router()

const { createFirstAssistant, getAssistant, updateAssistant } = require('../controllers/assistant')
const authMiddleware = require('../middlewares/auth')

router.post('/first-agent', authMiddleware, createFirstAssistant)
router.get('/', authMiddleware, getAssistant)
router.put('/', authMiddleware, updateAssistant)

module.exports = router