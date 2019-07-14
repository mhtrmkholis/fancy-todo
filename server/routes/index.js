const express = require('express');
const router = express.Router();
const todo = require('./todo');
const user = require('./user');
const boredApi = require('./3rd-party-api');

router.use('/users', user);
router.use('/todos', todo);
router.use('/', boredApi)

module.exports = router