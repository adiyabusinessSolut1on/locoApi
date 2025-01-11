const express = require('express');
const { testNotification, getNotificationById, readAtNotification } = require('../controller/notification');
const { isUser } = require('../middleware/rolebaseuserValidate');
const notifyRouter = express.Router();

notifyRouter.post('/test', testNotification)

notifyRouter.get('/:id', getNotificationById)

notifyRouter.put('/readAt/:id', isUser, readAtNotification)

module.exports = notifyRouter