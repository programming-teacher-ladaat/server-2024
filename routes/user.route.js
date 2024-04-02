const express = require('express');
const { signIn, signUp, updateUser } = require('../controllers/user.controller')
const { auth } = require('../middlewares/auth');

const router = express.Router();

// signin - התחברות
router.post('/signin', signIn)

// signup - הרשמה
router.post('/signup', signUp)

router.put('/:id', auth, updateUser);

module.exports = router;