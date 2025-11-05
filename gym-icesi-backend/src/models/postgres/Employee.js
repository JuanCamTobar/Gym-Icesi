const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Employee = sequelize.define('Employee', {
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
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  contract_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  employee_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  faculty_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  campus_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  birth_place_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'employees',
  timestamps: false,
});

module.exports = Employee;