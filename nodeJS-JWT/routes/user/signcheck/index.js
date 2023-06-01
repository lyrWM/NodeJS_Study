const router = require("express").Router();
const User = require("../../../mockData/users");

const auth = require("../../../middleware/auth");


router.get("/signcheck", (req, res) => {
    res.status(200).json(User);
})

router.get("signCheck/:username", auth.verifyToken);



module.exports = router;