const config = require('../config')
const request = require('request')

const getKMA_SENSOR = async (cnt) => {
    return new Promise((resolve, reject) => {
        request(config.KMA_API + cnt, function (err, response, body) {
            resolve(body)
        })
    })

}
exports.setClient = (client) => {
    return {
        "address": client.remoteAddress,
        "port": client.remotePort,
        "info": `${client.remoteAddress} : ${client.remotePort}`,
        "socket": client
    }
}
let cnt = 0;
exports.sendDataPerMinutes = async (client) => {
    try {
        let data = await getKMA_SENSOR(cnt)
        cnt++;
        client.write(data)
        setInterval(async () => {
            data = await getKMA_SENSOR(cnt)
            cnt++;
            client.write(data)
        }, config.SEND_INTERVAL)
    } catch (error) {
        throw error
    }

}
exports.getCurrentDate = () => {
    const d = new Date();
    const YYYY = d.getFullYear();
    const MM = (("00" + d.getMonth() + 1)).slice(-2)
    const DD = ("00" + d.getDate()).slice(-2)
    const hh = ("00" + d.getHours()).slice(-2)
    const mm = ("00" + d.getMinutes()).slice(-2)
    const ss = ("00" + d.getSeconds()).slice(-2)
    return `${YYYY}.${MM}.${DD} ${hh}:${mm}:${ss}`
} 
