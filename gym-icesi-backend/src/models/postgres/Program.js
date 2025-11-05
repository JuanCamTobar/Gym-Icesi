const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Program = sequelize.define('Program', {
  code: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  area_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'programs',
  timestamps: false,
});

module.exports = Program;