const express = require('express');
const {
    signIn,
    signUp
} = require('../controllers/user.controller')

const router = express.Router();

// signin - התחברות
router.post('/signin', signIn)

// signup - הרשמה
router.post('/signup', signUp)


module.exports = router;