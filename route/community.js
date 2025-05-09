const express = require('express');
const { getAllCommunity, addCommunity, updateCommunityContent, deleteCommunity, updateMediaCommunity, getCommunityByIdAndAll, addComment, addOrRemoveLikesOnCommunity, saveCommunityToProfile, testingController, getUserCommunity, getCommunityPagination, deleteMedia, addMedia } = require('../controller/community');
const { isUser } = require('../middleware/rolebaseuserValidate');
const commuRouter = express.Router();

commuRouter.get('/user/community/:id', isUser, getUserCommunity)

commuRouter.get('/get/all', isUser, getAllCommunity)

commuRouter.get('/:id', isUser, getCommunityByIdAndAll)

commuRouter.get('/', isUser, getAllCommunity)

commuRouter.get('/get/all/pagination', getCommunityPagination)

commuRouter.post('/add', isUser, addCommunity)

commuRouter.post('/community/media/add/:id', isUser, addMedia)

commuRouter.put('/content/:id', isUser, updateCommunityContent)

commuRouter.put('/media/:id', isUser, updateMediaCommunity)

commuRouter.delete('/:id', isUser, deleteCommunity)

commuRouter.put('/community/save/:id', isUser, saveCommunityToProfile)

commuRouter.delete('/community/media/:id', isUser, deleteMedia)

// likes
commuRouter.put('/likes/:id', isUser, addOrRemoveLikesOnCommunity)


// testing 
commuRouter.get('/testing', isUser, testingController)



module.exports = commuRouter