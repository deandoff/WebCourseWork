const Errors = require('../error/errors')
const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }
        try {
            const token = req.cookies.token;
            if (!token) {
                return next(Errors.unauthorized('Unathorized'))
            }
            const decodedData = jwt.verify(token, process.env.SECRET_KEY)
            if (decodedData.role !== role) {
                return next(Errors.forbidden('Forbidden'))
            }
            req.user = decodedData
            next()
        } catch (e) {
            return next(Errors.unauthorized('Unathorized'))
        }
    }
}