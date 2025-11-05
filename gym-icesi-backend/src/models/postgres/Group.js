const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const Group = sequelize.define('Group', {
  NRC: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semester: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  subject_code: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  professor_id: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
}, {
  tableName: 'groups',
  timestamps: false,
});

module.exports = Group;