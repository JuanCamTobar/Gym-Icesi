const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING(30),
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  student_id: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  employee_id: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;