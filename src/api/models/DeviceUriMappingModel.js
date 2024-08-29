const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const DeviceUriMapping = sequelize.define(
  "DeviceUriMapping",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    uri_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    device_id: {
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
    tableName: "device_uri_mapping",
    timestamps: true,
    createdAt: "creation_date",
    updatedAt: "updated_date",
  }
);

module.exports = DeviceUriMapping;
