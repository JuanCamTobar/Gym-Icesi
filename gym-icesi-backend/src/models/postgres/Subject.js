const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Subject = sequelize.define('Subject', {
  code: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  program_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'subjects',
  timestamps: false,
});

module.exports = Subject;