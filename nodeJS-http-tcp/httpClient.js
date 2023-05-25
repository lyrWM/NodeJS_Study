var http = require('http');

var options = { // 호출할 페이지 정보 설정
    host: "127.0.0.1",
    port: 9990,
    path: "/"
}

var req = http.request(options, (res) => { // 페이지를 호출
    var data = "";

    res.on('data', (chunk) => { // 서버에서 받아온 데이터 수신
        data += chunk;
    });

    res.on('end', () => { // 수신 완료하면 console에 출력
        console.log(data);
    });
});

req.end(); // 명시적 완료를 나타낸다.