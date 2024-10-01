const express = require('express');
const { registerUser, loginUser, findUser, users, deleteUser } = require('../authentication/auth');
const { handleSubmission } = require('../authentication/challenge');
const router = express.Router();

router.post('/register',registerUser);
router.post('/login', loginUser);
router.post('/submit', handleSubmission);
router.get('/find/:id', findUser);
router.get('/users', users);
router.delete('/delete/:id', deleteUser);

module.exports = router;
