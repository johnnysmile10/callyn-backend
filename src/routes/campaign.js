const express = require('express')
const router = express.Router()

const { createCampaign, getCampaigns } = require('../controllers/campaign')
const authMiddleware = require('../middlewares/auth')

router.use(authMiddleware);
router.post('/', createCampaign);
router.get('/', getCampaigns)

module.exports = router