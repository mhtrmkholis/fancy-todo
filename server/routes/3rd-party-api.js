const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/3rd-party-api-controller');

router.get('/bored', ApiController.randomTask)
router.get('/quote', ApiController.generateRandomQuote)

module.exports = router