const Router = require('express');
const router = new Router();
const userManagementController = require('../controllers/userManagementController')

router.post('/create', userManagementController.createUser)
router.post('/delete', userManagementController.deleteUser)
router.post('/update', userManagementController.updateUser)
router.get('/getall', userManagementController.getAllUsers)

module.exports = router