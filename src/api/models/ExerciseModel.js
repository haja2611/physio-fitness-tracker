// const { DataTypes } = require("sequelize");
// const sequelize = require("../utils/database");

// const Exercise = sequelize.define(
//   "Exercise",
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     type: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     creation_date: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     updated_date: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     created_by: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     updated_by: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     tableName: "exercise",
//     timestamps: true,
//     createdAt: "creation_date",
//     updatedAt: "updated_date",
//   }
// );

// module.exports = Exercise;
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Exercise = sequelize.define(
  "Exercise",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    exercise_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bodyPart: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    equipment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gifUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secondaryMuscles: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Storing array of strings
      allowNull: true,
    },
    instructions: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Storing array of strings
      allowNull: true,
    },
    creation_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "exercises",
    timestamps: true,
    createdAt: "creation_date",
    updatedAt: "updated_date",
  }
);

module.exports = Exercise;
