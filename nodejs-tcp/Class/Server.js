const net = require('net')
const server = new net.Server();
const util = require('../util')
class Server {
    constructor(port, address) {
        this.port = port || 12010
        this.address = address || '127.0.0.1'
        this.info = `${this.address} : ${this.port}`
        this.clientList = []
        this.server = null

        //외부에서 함수를 정의하기 위해 null로 셋팅을 해놓는다. 
        this.response = null
        this.connection = null
    }
    start(callback) {
        this.server = net.createServer(socket => {
            const client = util.setClient(socket)
            this.clientList.push(client)
            //연결되는 클라이언트에 대한 핸들러를 설정한다. 
            client.socket.on("error", e => {
                console.log(`${util.getCurrentDate()} [SERVER] client ${client.info} is closed`)
                this.clientList.splice(this.clientList.indexOf(client), 1)
            })
            //client가 idle상태인 것을 말합니다. 프로세스가 실행되지 않는 상태, IO인터럽트가 대기중 등의 상태를 말합니다.
            client.socket.on("timeout", () => {
                console.log(`${util.getCurrentDate()} [SERVER] client ${client.info} is timeout`)
            })
            client.socket.on("end", (data) => {
                //client가 FIN packet 을 보낼 때를 말합니다. 
                console.log(`${util.getCurrentDate()} [SERVER] client ${client.info} is end`)
                this.clientList.splice(this.clientList.indexOf(client), 1)
            })
            client.socket.on("data", data => {
                if (this.response) this.response(client, data)
            })
            if (this.connection) this.connection(client)
        })
        this.server.listen(this.port, this.address)
        this.server.on('listening', () => callback())

        this.server.on('close', () => { console.log(`${util.getCurrentDate()} [SERVER] is close`) })
        this.server.on('error', e => {
            console.log(`${util.getCurrentDate()} [SERVER] is error`)
            console.log(e)
        })
        this.server.on('disconnect', () => {
            console.log(`${util.getCurrentDate()} [SERVER] is disconnect`)
        })
    }
    broadcast(data, clientSender) {
        this.clientList.forEach(client => {

        })
    }
}

module.exports = Server