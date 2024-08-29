const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Clinic = sequelize.define(
  "Clinic",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    patient_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "clinic",
    timestamps: true,
    createdAt: "creation_date",
    updatedAt: "updated_date",
  }
);

module.exports = Clinic;
