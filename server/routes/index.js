const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const adminRouter = require('./adminRouter')
const scheduleRouter = require('./scheduleRouter')
const deanaryRouter = require('./deanaryRouter')


router.use('/', userRouter)
// router.use('/', scheduleRouter)
router.use('/admin', adminRouter)
router.use('/deanary', deanaryRouter)



module.exports = router