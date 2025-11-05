const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db.postgres');

const ContractType = sequelize.define('ContractType', {
  name: {
    type: DataTypes.STRING(30),
    primaryKey: true,
    allowNull: false,
  },
}, {
  tableName: 'contract_types',
  timestamps: false,
});

module.exports = ContractType;