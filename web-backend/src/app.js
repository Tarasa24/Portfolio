const express = require('express')
const cors = require('cors')

const app = express()
const router = express.Router()
const routes = require('./routes')(router, {})

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV === 'production') app.use('/api', routes)
else app.use('', routes)

module.exports = app
