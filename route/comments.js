const express = require('express')
const { isUser } = require('../middleware/rolebaseuserValidate')
const { addComment, likesAndUnlikesComment, addReplyToComment, deleteComment, getCommentsByCommunityId } = require('../controller/comment')
const commentRouter = express.Router()

commentRouter.get('/getByCommunityId/:id', isUser, getCommentsByCommunityId)

// commentRouter.get('/community/comments/:id', isUser)

commentRouter.post('/add/:id', isUser, addComment)

commentRouter.put('/likes/:id', isUser, likesAndUnlikesComment)

commentRouter.post('/replay/:commentId', isUser, addReplyToComment)

commentRouter.delete('/delete/:id', isUser, deleteComment)

module.exports = commentRouter