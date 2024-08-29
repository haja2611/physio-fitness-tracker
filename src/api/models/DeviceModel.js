const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Device = sequelize.define(
  "Device",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    device_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capabilities: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    current_load: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authorized: {
      type: DataTypes.STRING,
      allowNull: true,
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
  },
  {
    tableName: "device",
    timestamps: true,
    createdAt: "creation_date",
    updatedAt: "updated_date",
  }
);

module.exports = Device;
