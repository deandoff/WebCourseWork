const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const adminRouter = require('./adminRouter')
const deanaryRouter = require('./deanaryRouter')


router.use('/', userRouter)
router.use('/admin', adminRouter)
router.use('/deanary', deanaryRouter)

module.exports = router