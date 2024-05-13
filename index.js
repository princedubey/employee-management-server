const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const routes = require('./src/router/users-route')
const sequelize = require('./src/database/connection')
const errorHandler = require('./src/middleware/error-handler')
const rateLimit = require("express-rate-limit")
const cors = require('cors')

require('dotenv').config()
const app = express()
app.use(morgan('tiny'))

// Apply rate limiting middleware to element DDOS attack
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later"
})

app.use(cors())
app.use(bodyParser.json())
app.use(limiter)
app.use(routes)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Employee Management API'
  })
})

const PORT = process.env.PORT || 3000

sequelize.sync()
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
