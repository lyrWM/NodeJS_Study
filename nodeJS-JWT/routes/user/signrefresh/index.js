const router = require("express").Router();
const User = require("../../../mockData/users");
const jwt = require('../../../utils/jwt');

router.get('/refresh',jwt.refreshToken);


module.exports = router;