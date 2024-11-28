const express = require('express');
const { isAdmin } = require('../../middleware/rolebaseuserValidate');
const { getAppSetting, addSetting, deleteAppSetting } = require('../../controller/admin/Setting');
const settingRouter = express.Router()

settingRouter.get('/setting/', getAppSetting)
settingRouter.get('/setting/:id', getAppSetting)

settingRouter.post('/setting/add', /* isAdmin, */ addSetting)

settingRouter.put('/setting/update/:id', /* isAdmin, */ addSetting)

settingRouter.delete('/setting/delete/:id', /* isAdmin, */ deleteAppSetting)

module.exports = settingRouter