const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Routine = sequelize.define('Routine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'routines',
  timestamps: false,
});

module.exports = Routine;
