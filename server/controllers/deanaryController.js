const {Schedule, StudentGroup, User, Classroom, Group} = require('../models/models')
const Errors = require('../error/errors')

function getDayName(dayNumber) {
    const days = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота'
    ];
    return days[dayNumber - 1] || '—';
  }

class DeanaryController {

    async ScheduleManagementPage(req, res) {
        try {
            const teachers = await User.findAll({ where: { role: 'TEACHER' } });
            const groups = await Group.findAll();
            const classrooms = await Classroom.findAll();
            const schedulesRaw = await Schedule.findAll();
    
            const teacherMap = {};
            teachers.forEach(t => teacherMap[t.id] = t.fullname);
    
            const groupMap = {};
            groups.forEach(g => groupMap[g.id] = g.name);
    
            const classroomMap = {};
            classrooms.forEach(c => {
                classroomMap[c.id] = `Ауд. ${c.number}, Корпус ${c.building}`;
            });
    
            const schedules = schedulesRaw.map(s => ({
                ...s.dataValues,
                teacher_name: teacherMap[s.teacher_id] || '—',
                group_name: groupMap[s.group_id] || '—',
                classroom_name: classroomMap[s.classroom_id] || '—',
                day_name: getDayName(s.day_of_week),
            }));
    
            res.render('schedule_management', { teachers, groups, classrooms, schedules });
        } catch (error) {
            console.error('Error in ScheduleManagementPage:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    async CreateSchedule(req, res) {
        const {subject_name, subject_type, teacher_id, group_id, classroom_id, day_of_week, start_time, end_time} = req.body
        if (!subject_name || !subject_type || !teacher_id || !group_id || !classroom_id || !day_of_week || !start_time || !end_time) {
            return res.status(400).json({message: 'All fields are required'})
        }
        const schedule = await Schedule.create({subject_name, subject_type, teacher_id, group_id, classroom_id, day_of_week, start_time, end_time})
        return res.json(schedule)
    }

    async EditSchedule(req, res) {
        const { id, subject_name, subject_type, teacher_id, group_id, classroom_id, day_of_week, start_time, end_time } = req.body;
      
        if (!id || !subject_name || !subject_type || !teacher_id || !group_id || !classroom_id || !day_of_week || !start_time || !end_time) {
          return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
        }
      
        try {
          await Schedule.update({
            subject_name,
            subject_type,
            teacher_id,
            group_id,
            classroom_id,
            day_of_week,
            start_time,
            end_time
          }, {
            where: { id }
          });
      
          res.json({ message: 'Изменения сохранены' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Ошибка при сохранении изменений' });
        }
      }

    async DeleteSchedule(req, res) {
        const {id} = req.body
        if (!id) {
            return res.status(400).json({message: 'All fields are required'})
        }
        const schedule = await Schedule.destroy({where: {id}})
        return res.json(schedule)
    }

    async GetScheduleById(req, res) {
        const {id} = req.params; // Получаем ID из параметров запроса
        try {
            const schedule = await Schedule.findByPk(id); // Находим расписание по ID
            if (!schedule) {
                return res.status(404).json({ message: 'Расписание не найдено' });
            }

            // Получаем подробности для связанных сущностей, если необходимо
            const teacher = await User.findByPk(schedule.teacher_id);
            const group = await Group.findByPk(schedule.group_id);
            const classroom = await Classroom.findByPk(schedule.classroom_id);
            
            // Создаем объект с подробной информацией
            const scheduleData = {
                ...schedule.dataValues,
                teacher_name: teacher ? teacher.fullname : '—',
                group_name: group ? group.name : '—',
                classroom_name: classroom ? `Ауд. ${classroom.number}, Корпус ${classroom.building}` : '—',
                day_name: getDayName(schedule.day_of_week),
            };

            return res.json(scheduleData);
        } catch (error) {
            console.error('Error in GetScheduleById:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

}

module.exports = new DeanaryController()