const router = require("express").Router();
const User = require("../../../mockData/users");

const crypto = require('crypto');

const jwt = require('../../../utils/jwt.util');
const redisClient = require('../../../utils/redis.util');

router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    console.log(username);
    console.log(password);

    const findOne = User.filter((v, i) => v.username === username);

    if (!findOne) {
        res.status(404).send({ message: "Not Registered" });

    } else if (findOne) {
        console.log(typeof (findOne));
        for (var pw in findOne) {
            const findOnePw = findOne[pw].password;
            if (findOnePw === password) {

                const accessToken = jwt.sign(username);
                const refreshToken = jwt.refresh();

                redisClient.set(username, refreshToken);

                res.setHeader('Content-type', 'application/json; charset=utf-8');
                res.setHeader('Authorization', 'Bearer ' + accessToken);
                res.setHeader('Refresh', 'Bearer ' + refreshToken);


                res.status(200).json({
                    status: 200,
                    token: {
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                }).send({ message: "login Success" });
            } else {

                res.status(400).send({ message: "Login Failed" });
            }

        }
    }
})

module.exports = router;