const express = require('express')
const amqplib = require('amqplib')
const cors = require('cors')

const { ServerConfig , logger, Queue} = require('./config') 
const  apiRoutes  = require('./routes')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
//app.use(cors())
app.use('/api',apiRoutes)

app.listen(ServerConfig.Port,async ()=>{
    console.log(`Server Started Successfully at Port : ${ServerConfig.Port}`)
    await Queue.connectQueue()
})