const express = require('express')
const router = express.Router()

const { createPhoneNumber, getPhoneNumbers } = require('../controllers/phone')
const authMiddleware = require('../middlewares/auth')

router.post('/', authMiddleware, createPhoneNumber);
router.get('/', authMiddleware, getPhoneNumbers);

module.exports = router