const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/login', userController.loginPage);
router.post('/login', userController.login);
router.get('/home', userController.home);
router.post('/logout', userController.logout);

module.exports = router;


module.exports = router