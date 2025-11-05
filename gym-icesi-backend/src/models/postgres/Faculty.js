const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Faculty = sequelize.define('Faculty', {
  code: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  dean_id: {
    type: DataTypes.STRING(15),
    allowNull: true,
    unique: true,
  },
}, {
  tableName: 'faculties',
  timestamps: false,
});

module.exports = Faculty;