const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Area = sequelize.define('Area', {
  code: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  faculty_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  coordinator_id: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'areas',
  timestamps: false,
});

module.exports = Area;