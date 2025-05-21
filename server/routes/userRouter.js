const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/login', userController.loginPage);
router.post('/login', userController.login);
router.get('/home', userController.home);

router.get('/home/teacher/:id', userController.getTeacherById);
router.get('/home/group/:id/students', userController.getGroupStudents);
router.get('/home/teacher/:id/schedule', userController.getTeacherSchedule);
router.get('/home/group/:id/schedule', userController.getGroupSchedule);
router.get('/home/search/teachers', userController.searchTeacher);
router.get('/home/search/groups', userController.searchGroup);

router.post('/logout', userController.logout);

module.exports = router;


module.exports = router