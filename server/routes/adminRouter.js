const Router = require('express');
const router = new Router();
const userManagementController = require('../controllers/userManagementController')
const authMiddleware = require('../middleware/checkRoleMiddleware')

router.use(authMiddleware('ADMIN'))

router.post('/create', userManagementController.createUser)
router.delete('/delete', userManagementController.deleteUser)
router.put('/update', userManagementController.updateUser)
router.get('/getall', userManagementController.getAllUsers)

module.exports = router