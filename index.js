//require
const http=require('http')
const app=require('./app')
//server
const server=http.createServer(app)
//port
const port=process.env.port||3000
server.listen(port)
console.log('connected')