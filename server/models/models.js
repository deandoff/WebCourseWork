const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    fullname: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    createdate: {type: DataTypes.DATE, defaultValue: new Date()},
})

const Group = sequelize.define('group', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    course: {type: DataTypes.INTEGER}
})

const Classroom = sequelize.define('classroom', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.INTEGER},
    building: {type: DataTypes.INTEGER},
})

const Subject = sequelize.define('subject', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    type: {type: DataTypes.STRING},
})

const StudentGroup = sequelize.define('student_group', {
    student_id: {type: DataTypes.INTEGER},
    group_id: {type: DataTypes.INTEGER},
})

const Schedule = sequelize.define('schedule', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    subject_id: {type: DataTypes.INTEGER},
    teacher_id: {type: DataTypes.INTEGER},
    group_id: {type: DataTypes.INTEGER},
    classroom_id: {type: DataTypes.INTEGER},
    day_of_week: {type: DataTypes.INTEGER},
    start_time: {type: DataTypes.TIME},
    end_time: {type: DataTypes.TIME},
})

Schedule.hasMany(User)
User.belongsTo(Schedule)

Schedule.hasMany(Group)
Group.belongsTo(Schedule)

Schedule.hasMany(Classroom)
Classroom.belongsTo(Schedule)

Schedule.hasMany(Subject)
Subject.belongsTo(Schedule)

StudentGroup.hasMany(User)
User.belongsTo(StudentGroup)

StudentGroup.hasMany(Group)
Group.belongsTo(StudentGroup)

module.exports = {
    User,
    Group,
    Classroom,
    Subject,
    StudentGroup,
    Schedule
}

