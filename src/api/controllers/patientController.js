const Patient = require("../models/PatientModel");
const Clinic = require("../models/ClinicModel");
const logger = require("../utils/logger");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const UserRole = require("../models/UserRoleModel");
const crypto = require("crypto");
require("dotenv").config();
const nodemailer = require("nodemailer");

const updatePatientCountForClinic = async (clinic_id) => {
  const patientCount = await Patient.count({ where: { clinic_id } });
  await Clinic.update(
    { patient_count: patientCount },
    { where: { id: clinic_id } }
  );
};

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info("Email sent successfully", { to, subject });
  } catch (error) {
    logger.error("Error sending email", { error: error.message });
    throw error;
  }
};

// Function to send the password setup email
const sendPasswordSetupEmail = async (patient) => {
  const token = crypto.randomBytes(32).toString("hex");
  patient.password_reset_token = token;
  patient.password_reset_expires = Date.now() + 3600000; // 1 hour from now
  await patient.save();

  const resetUrl = `http://localhost:3000/set-password?token=${token}`;
  await sendEmail(
    patient.emailid,
    "Set Your Password",
    `Please click the following link to set your password: ${resetUrl}`
  );
};

exports.createPatient = async (req, res) => {
  try {
    const doctorId = req.user.userId;

    // Get clinic_id from the request body
    const { clinic_id } = req.body;
    // Validate that the clinic exists and is associated with the doctor
    const clinic = await Clinic.findOne({
      where: { id: clinic_id, doctor_id: doctorId },
    });
    if (!clinic) {
      return res.status(404).json({
        message: "Clinic not found or not associated with this doctor",
      });
    }

    const patientData = {
      ...req.body,
      doctor_id: doctorId,
      password: "", // Leave password empty initially
    };
    const patient = await Patient.create(patientData);
    await sendPasswordSetupEmail(patient);
    await updatePatientCountForClinic(patient.clinic_id);
    // Assign role to patient
    await UserRole.create({
      user_id: patient.id,
      user_type: "patient",
      role: "patient",
    });

    logger.info("Patient created and email sent successfully", { patient });
    res
      .status(201)
      .json({ message: "Patient created and email sent successfully" });
  } catch (error) {
    logger.error("Error creating patient", { error });
    res.status(500).json({ message: "Error creating patient", error });
  }
};
// Create a new patient
// exports.createPatient = async (req, res) => {
//   try {
//     const patientData = {
//       ...req.body,
//       password: "", // Leave password empty initially
//     };
//     const patient = await Patient.create(patientData);
//     await sendPasswordSetupEmail(patient);
//     await updatePatientCountForClinic(patient.clinic_id);
//     // Assign role to patient
//     await UserRole.create({
//       user_id: patient.id,
//       user_type: "patient",
//       role: "patient",
//     });

//     logger.info("Patient created and email sent successfully", { patient });
//     res
//       .status(201)
//       .json({ message: "Patient created and email sent successfully" });
//   } catch (error) {
//     logger.error("Error creating patient", { error });
//     res.status(500).json({ message: "Error creating patient", error });
//   }
// };

exports.resendPasswordSetupLink = async (req, res) => {
  try {
    const { emailid } = req.body;

    const patient = await Patient.findOne({ where: { emailid } });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await sendPasswordSetupEmail(patient);

    logger.info("Password setup email resent successfully", { patient });
    res
      .status(200)
      .json({ message: "Password setup email resent successfully" });
  } catch (error) {
    logger.error("Error resending password setup email", { error });
    res
      .status(500)
      .json({ message: "Error resending password setup email", error });
  }
};

exports.setPassword = async (req, res) => {
  try {
    const { token, password, confirm_password } = req.body;

    const patient = await Patient.findOne({
      where: {
        password_reset_token: token,
        password_reset_expires: {
          [Op.gt]: Date.now(), // Check if the token has not expired
        },
      },
    });

    if (!patient) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (password !== confirm_password) {
      return res.status(400).send("Passwords do not match");
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send(
          "Password must be at least 8 characters long and contain at least one letter and one number"
        );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    patient.password = hashedPassword;
    patient.password_reset_token = null;
    patient.password_reset_expires = null;
    await patient.save();

    logger.info("Password set successfully", { patient });
    res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    logger.error("Error setting password", { error });
    res.status(500).json({ message: "Error setting password", error });
  }
};

// Update a patient by ID
exports.updatePatient = async (req, res) => {
  try {
    const [updated] = await Patient.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedPatient = await Patient.findByPk(req.params.id);
      await updatePatientCountForClinic(updatedPatient.clinic_id);
      logger.info("Patient updated successfully", { updatedPatient });
      res.status(200).json(updatedPatient);
    } else {
      logger.warn("Patient not found for update", { patientId: req.params.id });
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    logger.error("Error updating patient", { error });
    res.status(500).json({ message: "Error updating patient", error });
  }
};

// Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
    });
    res.status(200).json(patients);
  } catch (error) {
    logger.error("Error fetching patients", { error });
    res.status(500).json({ message: "Error fetching patients", error });
  }
};

// Get a patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      attributes: {
        exclude: ["password", "password_reset_token", "password_reset_expires"],
      },
    });
    if (patient) {
      res.status(200).json(patient);
    } else {
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    logger.error("Error fetching patient", { error });
    res.status(500).json({ message: "Error fetching patient", error });
  }
};

// Delete a patient by ID
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (patient) {
      await Patient.destroy({ where: { id: req.params.id } });
      await updatePatientCountForClinic(patient.clinic_id);
      logger.info("Patient deleted successfully", { patientId: req.params.id });
      res.status(200).json({ message: "Patient deleted successfully" });
    } else {
      logger.warn("Patient not found for deletion", {
        patientId: req.params.id,
      });
      res.status(404).json({ message: "Patient not found" });
    }
  } catch (error) {
    logger.error("Error deleting patient", { error });
    res.status(500).json({ message: "Error deleting patient", error });
  }
};

// Fetch patients by clinic ID
exports.getPatientsByClinic = async (req, res) => {
  try {
    const { clinic_id } = req.params;
    const doctor_id = req.user.userId; // Assuming userId is stored in req.user after authentication

    const patients = await Patient.findAll({
      where: { clinic_id, doctor_id },
    });

    if (!patients.length) {
      return res
        .status(404)
        .json({ message: "No patients found for this clinic" });
    }

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
};

// Fetch patients by doctor ID
exports.getPatientsByDoctor = async (req, res) => {
  try {
    const doctor_id = req.user.userId; // Assuming userId is stored in req.user after authentication

    const patients = await Patient.findAll({
      where: { doctor_id },
    });

    if (!patients.length) {
      return res
        .status(404)
        .json({ message: "No patients found for this clinic" });
    }

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients", error });
  }
};
