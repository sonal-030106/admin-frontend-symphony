import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Rto = sequelize.define('Rto', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  }
}, {
  timestamps: true
});

// Define associations
// Rto.hasMany(Vehicle);
// Rto.hasMany(Fine);

export default Rto;
