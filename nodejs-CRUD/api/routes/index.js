const express = require('express');
const router = express.Router();

// Get 
router.get('/', (req, res, next) => {
    res.status(200).json({ Message: `GET - server is running! ` });
});

//Post
router.post('/', (req, res, next) => {
    res.status(200).json({ Message: `POST - server is running! ` });
});

module.exports = router;