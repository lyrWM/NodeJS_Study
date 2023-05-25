const net = require('net');

const client = net.createConnection({ port: 4000 }, () => {
    console.log('TCP 서버에 연결되었습니다.');
    client.write('안녕하세요, 서버!');
});

client.on('data', (data) => {
    console.log('서버로부터 데이터를 받았습니다:', data.toString());
});

client.on('end', () => {
    console.log('서버와의 연결이 끊어졌습니다.');
});



