const net = require('net');

const server = net.createServer((socket) => {
    console.log('클라이언트가 연결되었습니다.');

    socket.on('data', (data) => {
        console.log('클라이언트로부터 데이터를 받았습니다:', data.toString());
        socket.write('서버로부터 응답: ' + data.toString());
    });

    // socket.on('end', () => {
    //     console.log('클라이언트와 연결이 끊어졌습니다.');
    // });

    socket.on('close', function () {
        console.log('client disconnected');
    })

    socket.write('welcome to server');


});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('TCP 서버가 포트 ' + PORT + '에서 대기 중입니다.');
});