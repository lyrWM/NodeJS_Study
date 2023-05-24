'use strict';
const express = require('express');
const router = express.Router();
const users = require('../../mockData/users');

// Get users
router.get('/', (req, res, next) => {
    res.status(200).json(users);
});

// Get user by ID
router.get('/:id', (req, res, next) => {
    const userId = Number(req.params.id);
    const user = users.find(user => user.id === userId);
    if (!user) {
        res.status(404).json({ errorMessage: `User with ID ${req.params.id} does not exist.` });
        return;
    }
    res.status(200).json(user);
});

// Create a new user
router.post('/', (req, res, next) => {
    if (!req.body.name || !req.body.gender || !req.body.country || !req.body.job) {
        res.status(400).json({
            errorMessage: 'Invalid request body. Must include name, gender, country, and job.'
        });
        return;
    }

    req.body.id = users.length + 1;
    users.push(req.body);
    res.status(201).json(req.body);
});

// Update a user by ID
router.put('/:id', (req, res, next) => {
    const targetUser = users.find(user => user.id === Number(req.params.id));
    if (!targetUser) {
        res.status(404).json({ errorMessage: `User with ID ${req.params.id} does not exist.` });
        return;
    }

    for (const [key, value] of Object.entries(req.body)) {
        targetUser[key] = value;
    }

    res.status(200).json(targetUser);
});

// Delete a user by ID
router.delete('/:id', (req, res, next) => {
    const userIdx = users.findIndex(user => user.id === Number(req.params.id));
    if (!userIdx) {
        res.status(404).json({ errorMessage: `User with ID ${req.params.id} does not exist.` });
        return;
    }

    users.splice(userIdx, 1);
    res.status(200).json({ deleteUser: "Successfully delete." });
});

module.exports = router;