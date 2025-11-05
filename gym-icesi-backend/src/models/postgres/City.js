const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const City = sequelize.define('City', {
  code: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  dept_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'cities',
  timestamps: false,
});

module.exports = City;