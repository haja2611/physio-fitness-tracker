const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const ExerciseData = sequelize.define('ExerciseData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  exercise_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  device_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  end_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  coordinate: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
//   value: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
}, {
  tableName: 'exercise_data',
  timestamps: false,
});

module.exports = ExerciseData;
