const {User} = require('../models/models')
const Errors = require('../error/errors')
const bcrypt = require('bcrypt')

class UserManagementController {
    async createUser(req, res) {
        const {username, password, fullname, email, role} = req.body
        if (!username || !password || !fullname || !email || !role) {
            return res.status(400).json({message: 'All fields are required'})
        }
        const candidate = await User.findOne({where: {username}})
        if (candidate) {
            return res.status(400).json({message: 'User already exists'})
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({username, password: hashPassword, fullname, email, role})
        return res.json(user)
    }

    async deleteUser(req, res) {
        const {id} = req.body
        const deletedUser = await User.destroy({where: {id}})
        return res.json(deletedUser)
    }

    async updateUser(req, res) {
        const {id, username, password, fullname, email, role} = req.body
        const updatedUser = await User.update({username, password, fullname, email, role}, {where: {id}})
        return res.json(updatedUser)    
    }

    async getAllUsers(req, res) {
        const users = await User.findAll()
        return res.json(users)
    }
}

module.exports = new UserManagementController()