// src/models/index.js
const sequelize = require("../utils/sequelize");
const Doctor = require("./DoctorModel");
const Patient = require("./PatientModel");
const Clinic = require("./ClinicModel");
const Device = require("./DeviceModel");
const Exercise = require("./ExerciseModel");
const ExerciseRawData = require("./ExerciseRawDataModel");
const ExerciseData = require("./ExerciseDataModel");
const ExercisePostProcessing = require("./ExercisePostProcessingModel");
const Session = require("./SessionModel");
const DeviceUriMapping = require("./DeviceUriMappingModel");
const UserRole = require("./UserRoleModel");

// Associations
Doctor.hasMany(Patient, { foreignKey: "doctor_id", onDelete: "CASCADE" });
Patient.belongsTo(Doctor, { foreignKey: "doctor_id", onDelete: "CASCADE" });

Doctor.hasMany(Clinic, { foreignKey: "doctor_id", onDelete: "CASCADE" });
Clinic.belongsTo(Doctor, { foreignKey: "doctor_id", onDelete: "CASCADE" });

Clinic.hasMany(Patient, { foreignKey: "clinic_id", onDelete: "CASCADE" });
Patient.belongsTo(Clinic, { foreignKey: "clinic_id", onDelete: "CASCADE" });

Doctor.hasMany(Device, { foreignKey: "doctor_id", onDelete: "CASCADE" });
Device.belongsTo(Doctor, { foreignKey: "doctor_id", onDelete: "CASCADE" });

Doctor.hasMany(Session, { foreignKey: "doctor_id", onDelete: "CASCADE" });
Patient.hasMany(Session, { foreignKey: "patient_id", onDelete: "CASCADE" });
Clinic.hasMany(Session, { foreignKey: "clinic_id", onDelete: "CASCADE" });
Exercise.hasMany(Session, { foreignKey: "exercise_id", onDelete: "CASCADE" });
Device.hasMany(Session, { foreignKey: "device_id", onDelete: "CASCADE" });
Session.belongsTo(Patient, { foreignKey: "patient_id", onDelete: "CASCADE" });
Session.belongsTo(Doctor, { foreignKey: "doctor_id", onDelete: "CASCADE" });
Session.belongsTo(Clinic, { foreignKey: "clinic_id", onDelete: "CASCADE" });
Session.belongsTo(Exercise, { foreignKey: "exercise_id", onDelete: "CASCADE" });
Session.belongsTo(Device, { foreignKey: "device_id", onDelete: "CASCADE" });

Doctor.hasMany(ExerciseRawData, {
  foreignKey: "doctor_id",
  onDelete: "CASCADE",
});
Exercise.hasMany(ExerciseRawData, {
  foreignKey: "exercise_id",
  onDelete: "CASCADE",
});

Patient.hasMany(ExerciseRawData, {
  foreignKey: "patient_id",
  onDelete: "CASCADE",
});
Device.hasMany(ExerciseRawData, {
  foreignKey: "device_id",
  onDelete: "CASCADE",
});
ExerciseRawData.belongsTo(Doctor, {
  foreignKey: "doctor_id",
  onDelete: "CASCADE",
});
ExerciseRawData.belongsTo(Exercise, {
  foreignKey: "exercise_id",
  onDelete: "CASCADE",
});
ExerciseRawData.belongsTo(Device, {
  foreignKey: "device_id",
  onDelete: "CASCADE",
});
ExerciseRawData.belongsTo(Patient, {
  foreignKey: "patient_id",
  onDelete: "CASCADE",
});
Patient.hasMany(ExerciseData, {
  foreignKey: "patient_id",
  onDelete: "CASCADE",
});
Exercise.hasMany(ExerciseData, {
  foreignKey: "exercise_id",
  onDelete: "CASCADE",
});
Device.hasMany(ExerciseData, { foreignKey: "device_id", onDelete: "CASCADE" });

ExerciseData.belongsTo(Patient, {
  foreignKey: "patient_id",
  onDelete: "CASCADE",
});
ExerciseData.belongsTo(Exercise, {
  foreignKey: "exercise_id",
  onDelete: "CASCADE",
});
ExerciseData.belongsTo(Device, {
  foreignKey: "device_id",
  onDelete: "CASCADE",
});

Patient.hasMany(ExercisePostProcessing, {
  foreignKey: "patient_id",
  onDelete: "CASCADE",
});
Exercise.hasMany(ExercisePostProcessing, {
  foreignKey: "exercise_id",
  onDelete: "CASCADE",
});

ExercisePostProcessing.belongsTo(Exercise, {
  foreignKey: "exercise_id",
  onDelete: "CASCADE",
});
ExercisePostProcessing.belongsTo(Patient, {
  foreignKey: "patient_id",
  onDelete: "CASCADE",
});

Device.hasMany(DeviceUriMapping, {
  foreignKey: "device_id",
  onDelete: "CASCADE",
});
Patient.hasMany(DeviceUriMapping, {
  foreignKey: "patient_id",
  onDelete: "CASCADE",
});

DeviceUriMapping.belongsTo(Device, {
  foreignKey: "device_id",
  onDelete: "CASCADE",
});
DeviceUriMapping.belongsTo(Patient, {
  foreignKey: "patient_id",
  onDelete: "CASCADE",
});

UserRole.belongsTo(Doctor, {
  foreignKey: "user_id",
  constraints: false,
  as: "doctor",
});
UserRole.belongsTo(Patient, {
  foreignKey: "user_id",
  constraints: false,
  as: "patient",
});

Doctor.hasMany(UserRole, {
  foreignKey: "user_id",
  constraints: false,
  as: "roles",
});
Patient.hasMany(UserRole, {
  foreignKey: "user_id",
  constraints: false,
  as: "roles",
});

module.exports = {
  sequelize,
  Doctor,
  Patient,
  Clinic,
  Device,
  Exercise,
  ExerciseRawData,
  ExerciseData,
  ExercisePostProcessing,
  Session,
  DeviceUriMapping,
  UserRole,
};
