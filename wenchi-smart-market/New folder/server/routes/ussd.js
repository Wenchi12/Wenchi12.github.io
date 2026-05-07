const express = require('express');
const { handleUSSD } = require('../ussd');
const router = express.Router();

router.post('/', handleUSSD);

module.exports = router;
