const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');

router.post('/', UserController.create);
router.get('/', UserController.findAll);
router.post('/signin', UserController.signin);
router.post('/signin/google', UserController.googleSignin);

module.exports = router