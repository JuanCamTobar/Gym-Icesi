const { sequelize } = require('../../config/db.postgres');
const User = require('./User');
const Trainer = require('./Trainer');
const Routine = require('./Routine');
const Progress = require('./Progress');
const StatisticsUser = require('./StatisticsUser');
const StatisticsTrainer = require('./StatisticsTrainer');

// Define associations
User.hasMany(Routine, { foreignKey: 'user_id' });
Routine.belongsTo(User, { foreignKey: 'user_id' });

Routine.hasMany(Progress, { foreignKey: 'routine_id' });
Progress.belongsTo(Routine, { foreignKey: 'routine_id' });

User.hasMany(StatisticsUser, { foreignKey: 'user_id' });
StatisticsUser.belongsTo(User, { foreignKey: 'user_id' });

Trainer.hasMany(StatisticsTrainer, { foreignKey: 'trainer_id' });
StatisticsTrainer.belongsTo(Trainer, { foreignKey: 'trainer_id' });

// Assuming a user can be assigned to a trainer
// This creates a foreign key `trainerId` in the User model
Trainer.hasMany(User, { foreignKey: 'trainerId' });
User.belongsTo(Trainer, { foreignKey: 'trainerId' });

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true }); // Use { alter: true } to update table schemas without dropping data
    console.log('All PostgreSQL models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to synchronize PostgreSQL models:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Trainer,
  Routine,
  Progress,
  StatisticsUser,
  StatisticsTrainer,
  syncModels,
};
