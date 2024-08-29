const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const ExerciseRawData = sequelize.define(
  "ExerciseRawData",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_only: {
      type: DataTypes.DATEONLY, // Add this field
      allowNull: false,
    },
    x: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    y: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    z: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    x_angle: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    y_angle: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    z_angle: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "exercise_raw_data",
    timestamps: false,
  }
);

module.exports = ExerciseRawData;
