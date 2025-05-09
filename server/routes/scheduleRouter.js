const Router = require('express');
const router = new Router();
const scheduleController = require('../controllers/scheduleController')
const authMiddleware = require('../middleware/authMiddleware')

// router.use(authMiddleware("STUDENT"))
// router.use(authMiddleware("TEACHER"))

router.get('/schedule', scheduleController.getSchedulePage)

module.exports = router
