const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const User = require('./User');

const StatisticsUser = sequelize.define('StatisticsUser', {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: User,
      key: 'id',
    },
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

StatisticsUser.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(StatisticsUser, { foreignKey: 'user_id' });

module.exports = StatisticsUser;
