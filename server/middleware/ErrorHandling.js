const Errors = require('../error/errors')

module.exports = function (err, req, res, next) {
    if (err instanceof Errors) {
        return res.status(err.statusCode).json({ message: err.message })
    }
    return res.status(500).json({ message: 'Internal server error' })
}