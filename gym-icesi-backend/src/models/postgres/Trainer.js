const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Trainer = sequelize.define('Trainer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employee_id: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
}, {
  tableName: 'trainers',
  timestamps: true,
});

module.exports = Trainer;