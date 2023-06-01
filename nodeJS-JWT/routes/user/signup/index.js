const router = require("express").Router();
const User = require("../../../mockData/users");


router.post("/signup", (req, res) => {
    User.push(req.body);
    res.status(201).json(req.body);
})

module.exports = router;