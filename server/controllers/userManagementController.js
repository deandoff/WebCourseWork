const {User} = require('../models/models')
const Errors = require('../error/errors')

class UserManagementController {
    async createUser(req, res) {
        const {username, password, fullname, email, role} = req.body
        const newUser = await User.create({username, password, fullname, email, role})
        return res.json(newUser)
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