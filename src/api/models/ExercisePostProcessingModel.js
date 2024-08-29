const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const ExercisePostProcessing = sequelize.define('ExercisePostProcessing', {
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
  start_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  end_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  completion: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  exercise_count: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  exercise_duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  exercise_quality: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  raw_data_start_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  raw_data_end_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'exercise_post_processing',
  timestamps: false,
});

module.exports = ExercisePostProcessing;
