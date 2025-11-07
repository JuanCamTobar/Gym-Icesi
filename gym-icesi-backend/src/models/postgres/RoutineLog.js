const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const User = require('./User');

const RoutineLog = sequelize.define('RoutineLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING(30),
    allowNull: false,
    references: {
      model: User,
      key: 'username',
    },
  },
  routine_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  routine_type: {
    type: DataTypes.STRING, // e.g., 'Predefined', 'Custom'
    allowNull: true,
  },
  started_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'routine_logs',
  timestamps: false,
});

module.exports = RoutineLog;
