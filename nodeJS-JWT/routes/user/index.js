const router = require("express").Router();

const signUpRouter = require("./signup");
const signInRouter = require("./signin");
const signCheckRouter = require("./signcheck")

router.use("/", signUpRouter);
router.use("/", signInRouter);
router.use("/", signCheckRouter);

module.exports = router;