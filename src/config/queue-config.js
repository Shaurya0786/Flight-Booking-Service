const amqplib = require('amqplib')
const serverConfig = require('./server-config')


let connection,channel

async function connectQueue(){
    try {
        connection = await amqplib.connect('amqp://localhost')
        channel = await connection.createChannel()  // we can create channels in rabbitmq as it help in connecting multiple connections on a single TCP connection
        await channel.assertQueue(serverConfig.ProcessQueue)
    } catch (error) {
        console.log(error)
    }
}


async function sendMessageToQueue(data){
    try {
        await channel.sendToQueue(serverConfig.ProcessQueue,Buffer.from(JSON.stringify(data)))
    } catch (error) {
        console.log(error)
    }
}


module.exports={
    connectQueue,
    sendMessageToQueue
}