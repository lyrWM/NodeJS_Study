const config = require('./config')
const net = require('net')
const request = require('request')
const client = new net.Socket()
const util = require('./util')
client.connect(config.PORT, config.IP, () => {
    console.log(`${util.getCurrentDate()} [CLIENT] :: Connect to server successfully`)
    util.sendDataPerMinutes(client)
})

client.reconnect = interval => {
    setTimeout(() => {
        console.log(`${util.getCurrentDate()} [CLIENT] :: Try reconnect to server`)
        client.connect(config.PORT, config.IP)
    }, interval)
}

client.on('data', data => {
    console.log(`${util.getCurrentDate()} [CLIENT] :: Get data from server`)
    console.log(data)
})

client.on('error', e => {
    if (e.code === 'ECONNRESET') {
        console.log(`${util.getCurrentDate()} [CLIENT] :: server is dead from some reason`)
    } else {
        console.log(`${util.getCurrentDate()} [CLIENT] :: server status is closed turn on the server!!`)
    }
})

client.on('close', () => {
    console.log(`${util.getCurrentDate()} [CLIENT] :: client can't connect the server and then client close.`)
    client.reconnect(config.RECONNECT_INTERVAL)
})