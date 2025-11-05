const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.STRING(15),
    primaryKey: true,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  birth_place_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  campus_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'students',
  timestamps: false,
});

module.exports = Student;