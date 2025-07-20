const express = require('express')
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config()

const authRouter = require('./routes/user')
const campRouter = require('./routes/campaign')
const assistantRouter = require('./routes/assistant')
const phoneRouter = require('./routes/phone')
const callRouter = require('./routes/call')
const supportRouter = require('./routes/support')
const contactRouter = require('./routes/contact')

const app = express()
const port = 5000

app.use(cors())
app.use(express.json({ limit: "50mb" }))

app.use('/api/auth', authRouter)
app.use('/api/campaign', campRouter)
app.use('/api/assistant', assistantRouter)
app.use('/api/phone', phoneRouter)
app.use('/api/call', callRouter);
app.use('/api/support', supportRouter);
app.use('/api/contact', contactRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})