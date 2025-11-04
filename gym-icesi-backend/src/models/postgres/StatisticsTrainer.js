const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');
const Trainer = require('./Trainer');

const StatisticsTrainer = sequelize.define('StatisticsTrainer', {
  trainer_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: Trainer,
      key: 'id',
    },
  },
  month: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  new_assignments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  followups: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'statistics_trainers',
  timestamps: false,
});

StatisticsTrainer.belongsTo(Trainer, { foreignKey: 'trainer_id' });
Trainer.hasMany(StatisticsTrainer, { foreignKey: 'trainer_id' });

module.exports = StatisticsTrainer;
