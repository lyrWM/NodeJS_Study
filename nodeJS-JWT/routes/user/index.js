const router = require("express").Router();

const signUpRouter = require("./signup");
const signInRouter = require("./signin");
const signRefresh = require("./signrefresh");

router.use("/", signUpRouter);
router.use("/", signInRouter);
router.use("/",signRefresh);

module.exports = router;