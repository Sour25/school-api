import { Sequelize } from 'sequelize';
import dbConfig from '../config/db.config.js';
import StudentModel from './student.model.js';
import CourseModel from './course.model.js';
import TeacherModel from './teacher.model.js';
import UserModel from './user.model.js'; // ✅ import User model

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Student = StudentModel(sequelize, Sequelize);
db.Course = CourseModel(sequelize, Sequelize);
db.Teacher = TeacherModel(sequelize, Sequelize);
db.User = UserModel(sequelize, Sequelize); // ✅ initialize User model

// Associations if needed...
await sequelize.sync({ alter: true }); // ✅ sync models to database

export default db;
