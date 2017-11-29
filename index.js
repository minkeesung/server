// "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe"

const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
// app is an instance of express
const router = require('./router')
const mongoose = require('mongoose')

// DB Setup

mongoose.connect('mongodb://localhost:auth/auth');



// App Setup
app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*'}))
router(app)
// morgan and bodyParser are middleware, any incoming request to our server will pass through morgan and bodyPraser, app.use registers morgan and bparser as middleware
// morgan is logging framework
// bodyParser.json, any request that comes in is going to be parsed as if it was json.  even if it isn't a json request

// Server Setup
const port = process.env.PORT || 3090
// if there is an environment port variable defined use it or else use port 3090
const server = http.createServer(app)
// create a http server that knows how to receive http requests and send it to express App
server.listen(port)
console.log('server listeing on:', port)
