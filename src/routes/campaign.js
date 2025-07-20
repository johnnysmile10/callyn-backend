const express = require('express')
const router = express.Router()

const { createCampaign, getCampaigns } = require('../controllers/campaign')
const authMiddleware = require('../middlewares/auth')

router.post('/', authMiddleware, createCampaign);
router.get('/', authMiddleware, getCampaigns)

module.exports = router