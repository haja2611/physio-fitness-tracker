const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const UserRole = sequelize.define(
  "UserRole",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_type: {
      type: DataTypes.ENUM("doctor", "patient"),
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "user_role",
    timestamps: true,
    createdAt: "creation_date",
    updatedAt: "updated_date",
  }
);

module.exports = UserRole;
