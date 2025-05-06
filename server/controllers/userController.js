const Errors = require('../error/errors')
class UserController {
    async login(req, res) {
    }

    async check(req, res, next) {
        const {id} = req.query
        if (!id) {
            return next(Errors.badRequest('id not promoted'))
        }
        res.json(id)
    }
}

module.exports = new UserController()