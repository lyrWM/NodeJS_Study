const http = require('http');

var server = http.createServer((req, res) => { // HTTP 서버 인스턴스를 만든다.
    res.end("hello world");
});

server.listen(9990); // 서버에 포트를 할당