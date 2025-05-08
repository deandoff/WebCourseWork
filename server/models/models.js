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

const StudentGroup = sequelize.define('student_group', {
    student_id: {type: DataTypes.INTEGER},
    group_id: {type: DataTypes.INTEGER},
})

const Schedule = sequelize.define('schedule', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    subject_name: {type: DataTypes.STRING},
    subject_type: {type: DataTypes.STRING},
    teacher_id: {type: DataTypes.INTEGER},
    group_id: {type: DataTypes.INTEGER},
    classroom_id: {type: DataTypes.INTEGER},
    day_of_week: {type: DataTypes.INTEGER},
    start_time: {type: DataTypes.TIME},
    end_time: {type: DataTypes.TIME},
})

Schedule.belongsTo(User, { foreignKey: 'teacher_id' });
User.hasMany(Schedule, { foreignKey: 'teacher_id' });

Schedule.belongsTo(Group, { foreignKey: 'group_id' });
Group.hasMany(Schedule, { foreignKey: 'group_id' });

Schedule.belongsTo(Classroom, { foreignKey: 'classroom_id' });
Classroom.hasMany(Schedule, { foreignKey: 'classroom_id' });

module.exports = {
    User,
    Group,
    Classroom,
    StudentGroup,
    Schedule
}

