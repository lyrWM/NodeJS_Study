const Server = require('./Class/Server.js')
const config = require('./config')
const util = require('./util')

const Kundol_AWS = new Server(config.PORT, config.IP)

Kundol_AWS.start(() => console.log(`[Kundol_AWS] started at ${Kundol_AWS.info}`))
Kundol_AWS.connection = client => console.log(`[Kundol_AWS] <<<< ${client.info} is connected and create TCP established`)
Kundol_AWS.response = (client, data) => {
    data = data.toString()
    console.log(data)
    // setTimeout(()=>{
    //     throw "some error!";;
    // }, 1000) 
} 