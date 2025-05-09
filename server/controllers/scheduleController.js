const { Schedule, User, Group, StudentGroup, Classroom } = require('../models/models')
const Errors = require('../error/errors')

class scheduleController {
    async getSchedulePage(req, res) {
        const role = req.user.role;
        const userId = req.user.id;
        const username = req.user.username;

        let schedule = [];

        try {
            if (role === 'TEACHER') {
            schedule = await Schedule.findAll({
                where: { teacher_id: userId },
                include: [
                { model: Group },
                { model: Classroom }
                ],
                order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
            });
            } else if (role === 'STUDENT') {
            const studentGroup = await StudentGroup.findOne({ where: { student_id: userId } });

            if (studentGroup) {
                schedule = await Schedule.findAll({
                where: { group_id: studentGroup.group_id },
                include: [
                    { model: User, as: 'user' }, // teacher
                    { model: Classroom }
                ],
                order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
                });
            }
            }

            res.render('home', { username, role, schedule });
        } catch (error) {
            console.error('Failed to load schedule:', error);
            res.status(500).send('Internal server error');
        }
    }
}

module.exports = new scheduleController();