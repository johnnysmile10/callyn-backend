const express = require('express')
const router = express.Router()

const { getContacts, importContacts, deleteContact } = require('../controllers/contact')
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, getContacts)
router.post('/', authMiddleware, importContacts)
router.delete('/:id', authMiddleware, deleteContact)

module.exports = router