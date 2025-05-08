const { Group, StudentGroup, User } = require('../models/models')
const Errors = require('../error/errors')

class GroupController {

    // Получение всех групп
    async GetAllGroups(req, res) {
        const groups = await Group.findAll()
        res.json(groups)
    }

    // Рендер страницы управления группами
    async GroupManagementPage(req, res) {
        const groups = await Group.findAll()
        const students = await User.findAll({ where: { role: 'STUDENT' } })
        const studentGroups = await StudentGroup.findAll()

        res.render('group_management', {
            groups,
            students,
            studentGroups
        })
    }


    // Создание новой группы
    async CreateGroup(req, res) {
        const { name, course } = req.body
        if (!name || course == null) {
            return res.status(400).json({ message: 'Group name and course are required' })
        }

        const existingGroup = await Group.findOne({ where: { name } })
        if (existingGroup) {
            return res.status(400).json({ message: 'Group with this name already exists' })
        }

        const group = await Group.create({ name, course })
        res.json(group)
    }

    // Удаление группы
    async DeleteGroup(req, res) {
        const { id } = req.body
        if (!id) {
            return res.status(400).json({ message: 'Group ID is required' })
        }

        await StudentGroup.destroy({ where: { group_id: id } }) // Удаляем связи студентов
        const deleted = await Group.destroy({ where: { id } })
        res.json({ deleted })
    }

    // Добавление студента в группу
    async AddStudentToGroup(req, res) {
        const { student_id, group_id } = req.body
        if (!student_id || !group_id) {
            return res.status(400).json({ message: 'Student ID and Group ID are required' })
        }

        const user = await User.findOne({ where: { id: student_id } })
        if (!user || user.role !== 'STUDENT') {
            return res.status(400).json({ message: 'Invalid student' })
        }

        const existing = await StudentGroup.findOne({ where: { student_id } })
        if (existing) {
            return res.status(400).json({ message: 'Student already belongs to a group' })
        }

        const studentGroup = await StudentGroup.create({ student_id, group_id })
        res.json(studentGroup)
    }

    // Удаление студента из группы
    async RemoveStudentFromGroup(req, res) {
        const { student_id } = req.body
        if (!student_id) {
            return res.status(400).json({ message: 'Student ID is required' })
        }

        const deleted = await StudentGroup.destroy({ where: { student_id } })
        res.json({ deleted })
    }

    // Получение студентов в группе (опционально)
    async GetStudentsInGroup(req, res) {
        const { group_id } = req.params
        if (!group_id) {
            return res.status(400).json({ message: 'Group ID is required' })
        }

        const studentGroup = await StudentGroup.findAll({ where: { group_id } })
        const studentIds = studentGroup.map(sg => sg.student_id)

        const students = await User.findAll({ where: { id: studentIds } })
        res.json(students)
    }

    async GetStudentsWithoutGroup(req, res) {
        try {
            console.log('Запрос получен: Получение студентов без группы');
    
            const allStudents = await User.findAll({ where: { role: 'STUDENT' } })
            console.log(`Найдено студентов со статусом STUDENT: ${allStudents.length}`);
    
            const studentGroups = await StudentGroup.findAll()
            console.log(`Найдено записей StudentGroup: ${studentGroups.length}`);
    
            const studentIdsWithGroup = studentGroups.map(sg => sg.student_id)
            console.log('ID студентов с группой:', studentIdsWithGroup)
    
            const studentsWithoutGroup = allStudents.filter(student => !studentIdsWithGroup.includes(student.id))
            console.log(`Студентов без группы: ${studentsWithoutGroup.length}`)
            
            console.log('Ответ отправляется:', JSON.stringify(studentsWithoutGroup, null, 2));
            res.json(studentsWithoutGroup)
        } catch (error) {
            console.error('Ошибка в GetStudentsWithoutGroup:', error)
            res.status(500).json({ message: 'Ошибка при получении студентов без группы' })
        }
    }
    
}

module.exports = new GroupController()
