const express = require('express')
const router = express.Router()

const { sendTicket } = require('../utils/nodemailer')
const authMiddleware = require('../middlewares/auth')

router.post('/', authMiddleware, async (req, res) => {
  const { email } = req.user;
  const { title, content } = req.body;

  await sendTicket({ from: email, title, content })

  return res.status(200).send('success!');
})

module.exports = router