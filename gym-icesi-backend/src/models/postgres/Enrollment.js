const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Enrollment = sequelize.define('Enrollment', {
  student_id: {
    type: DataTypes.STRING(15),
    primaryKey: true,
    allowNull: false,
  },
  NRC: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  enrollment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
}, {
  tableName: 'enrollments',
  timestamps: false,
});

module.exports = Enrollment;