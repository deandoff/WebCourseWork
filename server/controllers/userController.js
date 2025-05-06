const e = require('express')
const Errors = require('../error/errors')
const {User} = require('../models/models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();

const generateJWT = (id, username, role) => {
    return jwt.sign({id, username, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
}

class UserController {
    async login(req, res, next) {
        const {username, password} = req.body
        const user = await User.findOne({where: {username}})
        if (!user) {
            return next(Errors.internal('User not found'))
        }
        const isValidPassword = bcrypt.compareSync(password, user.password)
        if (!isValidPassword) {
            return next(Errors.internal('Wrong password'))
        }
        const token = generateJWT(user.id, user.username, user.role)
        return res.json({token})
    }

    async check(req, res) {
        const token = generateJWT(req.user.id, req.user.username, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()