//require
const express = require("express")
const app = express()
const morgan = require('morgan')
const customerRouter = require('./Router/customer')
const tripRouter = require('./Router/trip')
const driverRouter = require('./Router/driver')
const busRouter= require("./Router/Bus")
//use
app.use(express.json())
app.use(morgan('dev'))
app.use("/api/customer",customerRouter)
app.use("/api/trip",tripRouter)
app.use("/api/driver",driverRouter)
app.use("/api/bus",busRouter)
//export
module.exports = app