const e = require('express')
const Errors = require('../error/errors')
const { Schedule, Group, Classroom, User, StudentGroup } = require('../models/models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();

const generateJWT = (id, username, role) => {
  return jwt.sign({ id, username, role }, process.env.SECRET_KEY, { expiresIn: '24h' })
}

class UserController {
  async loginPage(req, res) {
    res.render('login', { error: null });
  }

  async login(req, res, next) {
    console.log('[LOGIN] Start');

    try {
      console.log('[LOGIN] Body:', req.body);

      const { username, password } = req.body;
      if (!username || !password) {
        console.log('[LOGIN] Missing credentials');
        return res.render('login', { error: 'Both username and password are required' });
      }

      const user = await User.findOne({ where: { username } });
      console.log('[LOGIN] User:', user);

      if (!user) {
        console.log('[LOGIN] User not found');
        return res.render('login', { error: 'Invalid username or password' });
      }

      const isValidPassword = bcrypt.compareSync(password, user.password);
      console.log('[LOGIN] Password valid:', isValidPassword);

      if (!isValidPassword) {
        return res.render('login', { error: 'Invalid username or password' });
      }

      const token = generateJWT(user.id, user.username, user.role);
      console.log('[LOGIN] Token generated');

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      });

      console.log('[LOGIN] Cookie set, responding');
      return res.redirect('/home');
    } catch (error) {
      console.error('[LOGIN ERROR]', error);
      return next(Errors.internal('Login failed'));
    }
  }



  async logout(req, res) {
    res.clearCookie('token');
    return res.redirect('/login');
  }

  async home(req, res) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const { username, role, id: userId } = decoded;

      let schedule = [];
      let teachers = [];
      let currentGroup = null;
      const groups = await Group.findAll({ attributes: ['id', 'name'] });

      if (role === 'TEACHER') {
        schedule = await Schedule.findAll({
          where: { teacher_id: userId },
          include: [
            { model: Group },
            { model: Classroom }
          ],
          order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
        });
      }

      if (role === 'STUDENT') {
        const studentGroup = await StudentGroup.findOne({ where: { student_id: userId } });

        if (studentGroup) {
          currentGroup = await Group.findByPk(studentGroup.group_id);
          schedule = await Schedule.findAll({
            where: { group_id: studentGroup.group_id },
            include: [
              { model: User, as: 'teacher' },
              { model: Classroom }
            ],
            order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
          });

          teachers = await User.findAll({
            where: { role: 'TEACHER' },
            attributes: ['id', 'fullname']
          });
        }
      }
      res.render('home', {
        username,
        role,
        schedule,
        currentGroup,
        teachers,
        groups
      });
    } catch (err) {
      console.error('JWT error:', err);
      return res.redirect('/login');
    }
  }

  async check(req, res) {
    const token = generateJWT(req.user.id, req.user.username, req.user.role)
    return res.json({ token })
  }

  async getTeacherById(req, res, next) {
    try {
      const teacher = await User.findOne({
        where: { id: req.params.id, role: 'TEACHER' },
        attributes: ['fullname', 'email']
      });

      if (!teacher) {
        return next(Errors.internal('Преподаватель не найден'));
      }

      res.json(teacher);
    } catch (err) {
      console.error('Ошибка при получении преподавателя:', err);
      next(Errors.internal('Ошибка при получении преподавателя'));
    }
  }

  async getTeacherSchedule(req, res, next) {
    try {
      console.log(`Запрос расписания для преподавателя с ID: ${req.params.id}`);

      const schedule = await Schedule.findAll({
        where: { teacher_id: req.params.id },
        include: [
          { model: Group, attributes: ['name', 'course'] },
          { model: Classroom, attributes: ['building', 'number'] }
        ],
        order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
      });

      const simplifiedSchedule = schedule.map(item => {
        return {
          id: item.id,
          subject_name: item.subject_name,
          subject_type: item.subject_type,
          day_of_week: item.day_of_week,
          start_time: item.start_time,
          end_time: item.end_time,
          group_name: item.group.name,
          group_course: item.group.course,
          classroom_building: item.classroom.building,
          classroom_number: item.classroom.number
        };
      });

      console.log(simplifiedSchedule);

      res.json(simplifiedSchedule);
    } catch (err) {
      console.error('Ошибка при получении расписания преподавателя:', err);
      next(Errors.internal('Ошибка при получении расписания преподавателя'));
    }
  }

  async getGroupSchedule(req, res, next) {
    try {
      const schedule = await Schedule.findAll({
        where: { group_id: req.params.id },
        include: [
          { model: User, as: 'teacher', attributes: ['fullname'] },
          { model: Classroom, attributes: ['building', 'number'] },
          { model: Group, as: 'group', attributes: ['name'] }
        ],
        order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
      });

      console.log(schedule);

      const simplifiedSchedule = schedule.map(item => ({
        id: item.id,
        subject_name: item.subject_name,
        subject_type: item.subject_type,
        day_of_week: item.day_of_week,
        start_time: item.start_time,
        end_time: item.end_time,
        teacher_fullname: item.teacher ? item.teacher.fullname : 'Неизвестен',
        classroom_building: item.classroom.building,
        classroom_number: item.classroom.number,
        group_name: item.group ? item.group.name : 'Неизвестная группа'
      }));

      res.json(simplifiedSchedule);
    } catch (err) {
      console.error('Ошибка при получении расписания группы:', err);
      next(Errors.internal('Ошибка при получении расписания группы'));
    }
  }

  async getGroupStudents(req, res, next) {
    try {
      const group = await Group.findByPk(req.params.id);
      if (!group) {
        return next(Errors.internal('Группа не найдена'));
      }

      const studentLinks = await StudentGroup.findAll({ where: { group_id: group.id } });

      const studentIds = studentLinks.map(link => link.student_id);

      const students = await User.findAll({
        where: {
          id: studentIds,
          role: 'STUDENT'
        },
        attributes: ['id', 'fullname', 'email'],
        order: [['fullname', 'ASC']]
      });

      res.json({
        group_name: group.name,
        students
      });
    } catch (err) {
      console.error('Ошибка при получении студентов группы:', err);
      next(Errors.internal('Ошибка при получении студентов группы'));
    }
  }
}

module.exports = new UserController()