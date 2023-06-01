const router = require("express").Router();

const userRouter = require("./user");

router.use("/user", userRouter);


router.get("/", (req, res) => {
    res.status(200).send({ message: "server-client connect success" });
})

module.exports = router;