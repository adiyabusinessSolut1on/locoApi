const express = require('express');
const { getBannerById, getBanner, addBanner, updateBanner, deleteBanner } = require('../controller/banner');
const bannerRouter = express.Router();

bannerRouter.get('/banner/:id', getBannerById)

bannerRouter.get('/banner', getBanner)

bannerRouter.post('/banner/add', addBanner)

bannerRouter.put('/banner/:id', updateBanner)

bannerRouter.delete('/banner/:id', deleteBanner)

module.exports = bannerRouter