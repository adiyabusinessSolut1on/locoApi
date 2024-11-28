const express = require('express');
const { testNotification, getNotificationById } = require('../controller/notification');
const notifyRouter = express.Router();

notifyRouter.post('/test', testNotification)

notifyRouter.get('/:id', getNotificationById)

module.exports = notifyRouter