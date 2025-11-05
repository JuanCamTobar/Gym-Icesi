const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const EmployeeType = sequelize.define('EmployeeType', {
  name: {
    type: DataTypes.STRING(30),
    primaryKey: true,
    allowNull: false,
  },
}, {
  tableName: 'employee_types',
  timestamps: false,
});

module.exports = EmployeeType;