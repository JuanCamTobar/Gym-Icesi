const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const Routine = require('./Routine');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  routine_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Routine,
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  time: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  effort: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'progress',
  timestamps: false,
});

Progress.belongsTo(Routine, { foreignKey: 'routine_id' });
Routine.hasMany(Progress, { foreignKey: 'routine_id' });

module.exports = Progress;
