const { sequelize } = require('../../config/db.postgres');
const User = require('./User');
const Trainer = require('./Trainer');
const Routine = require('./Routine');
const Progress = require('./Progress');
const StatisticsUser = require('./StatisticsUser');
const StatisticsTrainer = require('./StatisticsTrainer');

// New models
const Area = require('./Area');
const Subject = require('./Subject');
const City = require('./City');
const Department = require('./Department');
const Employee = require('./Employee');
const Faculty = require('./Faculty');
const Group = require('./Group');
const Country = require('./Country');
const Program = require('./Program');
const Campus = require('./Campus');
const ContractType = require('./ContractType');
const EmployeeType = require('./EmployeeType');
const Student = require('./Student');
const Enrollment = require('./Enrollment');

// Define associations
User.hasMany(Routine, { foreignKey: 'user_id', sourceKey: 'username' });
Routine.belongsTo(User, { foreignKey: 'user_id', targetKey: 'username' });

Routine.hasMany(Progress, { foreignKey: 'routine_id' });
Progress.belongsTo(Routine, { foreignKey: 'routine_id' });

User.hasMany(StatisticsUser, { foreignKey: 'user_id', sourceKey: 'username' });
StatisticsUser.belongsTo(User, { foreignKey: 'user_id', targetKey: 'username' });

Trainer.hasMany(StatisticsTrainer, { foreignKey: 'trainer_id' });
StatisticsTrainer.belongsTo(Trainer, { foreignKey: 'trainer_id' });

// Assuming a user can be assigned to a trainer
// This creates a foreign key `trainerId` in the User model
Trainer.hasMany(User, { foreignKey: 'trainerId' });
User.belongsTo(Trainer, { foreignKey: 'trainerId' });

// New Associations
Area.belongsTo(Faculty, { foreignKey: 'faculty_code' });
Faculty.hasMany(Area, { foreignKey: 'faculty_code' });
Area.belongsTo(Employee, { foreignKey: 'coordinator_id' });
Employee.hasOne(Area, { foreignKey: 'coordinator_id' });

Subject.belongsTo(Program, { foreignKey: 'program_code' });
Program.hasMany(Subject, { foreignKey: 'program_code' });

City.belongsTo(Department, { foreignKey: 'dept_code' });
Department.hasMany(City, { foreignKey: 'dept_code' });

Department.belongsTo(Country, { foreignKey: 'country_code' });
Country.hasMany(Department, { foreignKey: 'country_code' });

Employee.belongsTo(ContractType, { foreignKey: 'contract_type' });
ContractType.hasMany(Employee, { foreignKey: 'contract_type' });
Employee.belongsTo(EmployeeType, { foreignKey: 'employee_type' });
EmployeeType.hasMany(Employee, { foreignKey: 'employee_type' });
Employee.belongsTo(Faculty, { foreignKey: 'faculty_code' });
Faculty.hasMany(Employee, { foreignKey: 'faculty_code' });
Employee.belongsTo(Campus, { foreignKey: 'campus_code' });
Campus.hasMany(Employee, { foreignKey: 'campus_code' });
Employee.belongsTo(City, { foreignKey: 'birth_place_code' });
City.hasMany(Employee, { foreignKey: 'birth_place_code' });

Faculty.belongsTo(Employee, { foreignKey: 'dean_id' });
Employee.hasOne(Faculty, { foreignKey: 'dean_id' });

Group.belongsTo(Subject, { foreignKey: 'subject_code' });
Subject.hasMany(Group, { foreignKey: 'subject_code' });
Group.belongsTo(Employee, { foreignKey: 'professor_id' });
Employee.hasMany(Group, { foreignKey: 'professor_id' });

Program.belongsTo(Area, { foreignKey: 'area_code' });
Area.hasMany(Program, { foreignKey: 'area_code' });

Campus.belongsTo(City, { foreignKey: 'city_code' });
City.hasMany(Campus, { foreignKey: 'city_code' });

Student.belongsTo(City, { foreignKey: 'birth_place_code' });
City.hasMany(Student, { foreignKey: 'birth_place_code' });
Student.belongsTo(Campus, { foreignKey: 'campus_code' });
Campus.hasMany(Student, { foreignKey: 'campus_code' });

Enrollment.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(Enrollment, { foreignKey: 'student_id' });
Enrollment.belongsTo(Group, { foreignKey: 'NRC' });
Group.hasMany(Enrollment, { foreignKey: 'NRC' });

User.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasOne(User, { foreignKey: 'student_id' });
User.belongsTo(Employee, { foreignKey: 'employee_id' });
Employee.hasOne(User, { foreignKey: 'employee_id' });

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true }); // Use { alter: true } to update table schemas without dropping data
    console.log('All PostgreSQL models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to synchronize PostgreSQL models:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Trainer,
  Routine,
  Progress,
  StatisticsUser,
  StatisticsTrainer,
  Area,
  Subject,
  City,
  Department,
  Employee,
  Faculty,
  Group,
  Country,
  Program,
  Campus,
  ContractType,
  EmployeeType,
  Student,
  Enrollment,
  syncModels,
};