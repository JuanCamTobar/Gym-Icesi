const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Country = sequelize.define('Country', {
  code: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'countries',
  timestamps: false,
});

module.exports = Country;