const { User } = require('../models/models')
const Errors = require('../error/errors')
const bcrypt = require('bcrypt')

class UserManagementController {
    async createUser(req, res) {
        const { username, password, fullname, email, role } = req.body
        if (!username || !password || !fullname || !email || !role) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const candidate = await User.findOne({ where: { username } })
        if (candidate) {
            return res.status(400).json({ message: 'User already exists' })
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({ username, password: hashPassword, fullname, email, role })
        return res.json(user)
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const deletedUser = await User.destroy({ where: { id } });
            if (!deletedUser) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            return res.json({ message: 'Пользователь удалён' });
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            return res.status(500).json({ message: 'Ошибка сервера при удалении пользователя' });
        }
    }


    async updateUser(req, res) {
        const { id, username, password, fullname, email, role } = req.body;
        if (!id || !username || !fullname || !email || !role) {
            return res.status(400).json({ message: 'Required fields missing' });
        }
        const updateFields = {
            username,
            fullname,
            email,
            role
        };
        if (password) {
            const hashPassword = await bcrypt.hash(password, 5);
            updateFields.password = hashPassword;
        }
        try {
            const result = await User.update(updateFields, { where: { id } });
            return res.json({ message: 'User updated', result });
        } catch (error) {
            console.error('Update error:', error);
            return res.status(500).json({ message: 'Server error during update' });
        }
    }


    async getAllUsers(req, res) {
        const users = await User.findAll()
        return res.json(users)
    }

    async adminPage(req, res) {
        const users = await User.findAll();
        res.render('admin_users', { users });
    }
}

module.exports = new UserManagementController()