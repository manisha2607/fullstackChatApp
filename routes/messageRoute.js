const express = require('express');
const router = express.Router();
const msgController = require('../controller/messageController');

router.post('/createmsg', msgController.createMessage);
router.get('/getmsg', msgController.getMessages);


module.exports = router