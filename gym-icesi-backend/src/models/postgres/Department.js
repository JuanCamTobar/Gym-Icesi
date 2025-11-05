const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Department = sequelize.define('Department', {
  code: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  country_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'departments',
  timestamps: false,
});

module.exports = Department;