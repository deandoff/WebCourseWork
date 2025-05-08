const Router = require('express');
const router = new Router();
const deanaryController = require('../controllers/deanaryController')
const gropController = require('../controllers/groupController')
const authMiddleware = require('../middleware/checkRoleMiddleware')

router.use(authMiddleware('DEANARY'))

router.get('/schedule', deanaryController.ScheduleManagementPage)
router.post('/schedule/create', deanaryController.CreateSchedule)
router.delete('/schedule/delete', deanaryController.DeleteSchedule)
router.put('/schedule/edit', deanaryController.EditSchedule)
router.get('/schedule/:id', deanaryController.GetScheduleById)

router.get('/groups', gropController.GroupManagementPage)
router.post('/groups/create', gropController.CreateGroup)
// router.put('/groups/update', gropController.UpdateGroup)
router.delete('/groups/delete/:id', gropController.DeleteGroup)

router.get('/groups/no-group', gropController.GetStudentsWithoutGroup)
router.get('/groups/:group_id', gropController.GetStudentsInGroup)
router.post('/groups/add-student', gropController.AddStudentToGroup)
router.delete('/groups/remove-student', gropController.RemoveStudentFromGroup)


module.exports = router