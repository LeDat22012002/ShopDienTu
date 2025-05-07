const router = require('express').Router();
const chatBoxAI = require('../controller/chatbox');

router.post('/createChatbox', chatBoxAI.chatBoxAI); // POST /api/chat

module.exports = router;
