const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const StatisticsUser = sequelize.define('StatisticsUser', {
  user_id: {
    type: DataTypes.STRING(30),
    primaryKey: true,
  },
  month: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  routines_started: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  followups: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'statistics_users',
  timestamps: false,
});

module.exports = StatisticsUser;
