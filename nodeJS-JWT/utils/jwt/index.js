// jwtUtil-util.js
const { promisify } = require('util');
const jwtUtil = require('jsonwebtoken');
const redisClient = require('../redis');
require('dotenv').config();
//.env 파일 못읽고있음!!!
const secret = process.env.JWT_KEY;
// const { JWT_KEY } = process.env;

const sign = (email) => { // access token 발급
    const payload = { // access token에 들어갈 payload
        email: email
    };
    console.log(payload);

    return jwtUtil.sign(payload, secret, { // secret으로 sign하여 발급하고 return
        expiresIn: '1h',       // 유효기간
        algorithm: 'HS256', // 암호화 알고리즘
    });
}

const verify = (token) => { // access token 검증
    let decoded = null;
    try {
        decoded = jwtUtil.verify(token, secret);
        return {
            type: true,
            email: decoded.email,
        };
    } catch (err) {
        return {
            type: false,
            message: err.message,
        };
    }
}

const refresh = () => { // refresh token 발급
    return jwtUtil.sign({}, secret, { // refresh token은 payload 없이 발급
        algorithm: 'HS256',
        expiresIn: '14d',
    });
}

const refreshVerify =  async (token, email) => { // refresh token 검증
    /* redis 모듈은 기본적으로 promise를 반환하지 않으므로, promisify를 이용하여 promise를 반환하게 해줍니다.*/
    const getAsync = promisify(redisClient.get).bind(redisClient);

    try {
        const data = await getAsync(email); // refresh token 가져오기
        if (token === data) {
            try {
                jwtUtil.verify(token, secret);
                return true;
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

const verifyToken = async (req, res, next) => {
    const headers = req.headers;
    if (!headers.hasOwnProperty('authorization')) {
        return res.status(200).json({
            status: 403,
            success: false,
            message: '로그인이 필요합니다.'
        });
    }
    const token = req.headers.authorization.split('Bearer ')[1] || req.headers['x-access-token']
    if (!token || token === 'null') {
        return res.status(200).json({
            status: 403,
            success: false,
            message: '로그인이 필요합니다.'
        })
    }
    // 토큰이 유효한지 검증

    let info = {
        type: false,
        message: ''
    }

    const p = new Promise((resolve, reject) => {
        jwtUtil.verify(token, secret, (err, decoded) => {
            if (err) { // 토큰이 일치하지 않음.
                console.error(err)
                info.type = false;
                info.message = '토큰이 일치하지 않습니다.';
                return res.status(200).json({
                    status: 403,
                    success: false,
                    info: info,
                })
            }
            resolve(decoded);
        })
    });

    p.then((decoded) => {
        req.decoded = decoded;
        next();
    })

}

const refreshToken = async (req, res) => {
    // access token과 refresh token의 존재 유무를 체크합니다.
    if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;

        // access token 검증 -> expired여야 함.
        const authResult = verify(authToken);

        // access token 디코딩하여 user의 정보를 가져옵니다.
        const decoded = jwtUtil.decode(authToken);
        

        // 디코딩 결과가 없으면 권한이 없음을 응답.
        if (decoded === null) {
            return res.status(401).send({
                type: false,
                message: '권한이 없습니다!',
            });
        }

        /* access token의 decoding 된 값에서
          유저의 아이디를 가져와 refresh token을 검증합니다. */
        const refreshResult = refreshVerify(refreshToken, decoded.email);

        // 재발급을 위해서는 access token이 만료되어 있어야합니다.
        if (authResult.ok === false && authResult.message === 'jwt expired') {
            // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
            if (refreshResult.ok === false) {
                res.status(401).send({
                    type: false,
                    message: '새로 로그인해야 합니다.',
                });
            } else {
                // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
                const newAccessToken = sign(decoded.email);

                return res.status(200).send({ // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
                    type: true,
                    data: {
                        accessToken: newAccessToken,
                        refreshToken,
                    },
                });
            }
        } else {
            // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
            return res.status(400).send({
                type: false,
                message: 'Access Token이 만료되지 않았습니다.',
            });
        }
    } else { // access token 또는 refresh token이 헤더에 없는 경우
        return res.status(400).send({
            type: false,
            message: '재발급 받기 위해 Access Token과 Refresh Token이 필요합니다.',
        });
    }
}


module.exports = {
    sign,
    verify,
    refresh,
    refreshVerify,
    verifyToken,
    refreshToken
};