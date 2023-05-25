const express = require('express');
const app = express();

const PORT = 4000;

app.get('/', (req, res) => {
    res.send('Express 서버가 동작 중입니다.');
});

app.listen(PORT, () => {
    console.log('Express 서버가 포트 ' + PORT + '에서 대기 중입니다.');
});