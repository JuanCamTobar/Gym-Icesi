const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Campus = sequelize.define('Campus', {
  code: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  city_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'campuses',
  timestamps: false,
});

module.exports = Campus;