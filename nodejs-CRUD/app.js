'use strict'; // strict 모드 사용
const app = require('express')();
const bodyParser = require('body-parser');
const userRoute = require('./api/routes/user');
const indexRoute = require('./api/routes/index');

const serverPort = Number(process.env.SERVER_PORT) || 9090; // SERVER_PORT 환경변수 값이 존재할 시 사용, 그 외에 9090 사용

app.use(bodyParser.json({ strict: false })); // bodyParse 미들웨어 사용
app.use('/users', userRoute); // userRoute 를 미들웨어로서 사용
app.use('/', indexRoute); // localhost:port 접근 시 화면 표출 라우터

// 서버 가동
app.listen(serverPort, () => {
    console.log(`App listening on port ${serverPort}.`);
});