const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const orders = require('./routes/orders')
const meals = require('./routes/meals')
const auth = require('./routes/auth')

app = express()

app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use('/api/orders', orders)
app.use('/api/meals', meals)
app.use('/api/auth', auth)

module.exports = app