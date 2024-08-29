const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Session = sequelize.define(
  "Session",
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
    clinic_id: {
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
    start_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    end_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    creation_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "session",
    timestamps: true,
    createdAt: "creation_date",
    updatedAt: "updated_date",
  }
);

module.exports = Session;
