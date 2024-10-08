const express = require('express');
const router = express.Router();
const {createPoll,getPolls,getPollById,updatePoll,deletePoll,getMixedpollpost} = require('../controller/pollController');
const { isUser } = require("../middleware/rolebaseuserValidate");

router.post('/polls',isUser, createPoll);
router.get('/polls',getPolls);
router.get('/polls/:id',isUser,getPollById);
router.put('/polls/:id/:optionId',isUser,updatePoll);
router.delete('/polls/:id',isUser,deletePoll);
router.get("/post_poll",getMixedpollpost);
module.exports = router;