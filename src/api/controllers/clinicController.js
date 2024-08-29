const Clinic = require("../models/ClinicModel");
const Patient = require("../models/PatientModel");
const { Op } = require("sequelize");
const logger = require("../utils/logger");

exports.createClinic = async (req, res) => {
  try {
    // Get the doctor_id from the authenticated user
    const doctorId = req.user.userId;

    // Create the clinic with the doctor_id automatically set
    const clinic = await Clinic.create({
      ...req.body,
      doctor_id: doctorId, // Automatically set doctor_id
    });

    logger.info("Clinic created successfully", { clinic });
    res.status(201).json(clinic);
  } catch (error) {
    logger.error("Error creating clinic", { error });
    res.status(500).json({ message: "Error creating clinic", error });
  }
};

// Create a new clinic
// exports.createClinic = async (req, res) => {
//   try {
//     const clinic = await Clinic.create(req.body);
//     logger.info("Clinic created successfully", { clinic });
//     res.status(201).json(clinic);
//   } catch (error) {
//     logger.error("Error creating clinic", { error });
//     res.status(500).json({ message: "Error creating clinic", error });
//   }
// };

// Get all clinics
exports.getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.findAll();
    logger.info("Retrieved all clinics", { clinics });
    res.status(200).json(clinics);
  } catch (error) {
    logger.error("Error retrieving clinics", { error });
    res.status(500).json({ message: "Error retrieving clinics", error });
  }
};

// Get a clinic by ID
exports.getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (clinic) {
      logger.info("Retrieved clinic by ID", { clinic });
      res.status(200).json(clinic);
    } else {
      logger.warn("Clinic not found", { clinicId: req.params.id });
      res.status(404).json({ message: "Clinic not found" });
    }
  } catch (error) {
    logger.error("Error retrieving clinic by ID", { error });
    res.status(500).json({ message: "Error retrieving clinic by ID", error });
  }
};

// Update a clinic by ID
exports.updateClinic = async (req, res) => {
  try {
    const [updated] = await Clinic.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedClinic = await Clinic.findByPk(req.params.id);
      logger.info("Clinic updated successfully", { updatedClinic });
      res.status(200).json(updatedClinic);
    } else {
      logger.warn("Clinic not found for update", { clinicId: req.params.id });
      res.status(404).json({ message: "Clinic not found" });
    }
  } catch (error) {
    logger.error("Error updating clinic", { error });
    res.status(500).json({ message: "Error updating clinic", error });
  }
};

// Delete a clinic by ID
// exports.deleteClinic = async (req, res) => {
//   try {
//     const deleted = await Clinic.destroy({ where: { id: req.params.id } });
//     if (deleted) {
//       logger.info("Clinic deleted successfully", { clinicId: req.params.id });
//       res.status(200).json({ message: "Clinic deleted successfully" });
//     } else {
//       logger.warn("Clinic not found for deletion", { clinicId: req.params.id });
//       res.status(404).json({ message: "Clinic not found" });
//     }
//   } catch (error) {
//     logger.error("Error deleting clinic", { error });
//     res.status(500).json({ message: "Error deleting clinic", error });
//   }
// };
exports.deleteClinic = async (req, res) => {
  try {
    const clinicId = req.params.id;
    const clinic = await Clinic.findByPk(clinicId);

    if (!clinic) {
      return res.status(404).json({ error: "Clinic not found" });
    }

    await clinic.destroy(); // This should trigger cascade delete

    res.status(200).json({ message: "Clinic deleted successfully" });
  } catch (error) {
    console.error("Error deleting clinic:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePatientCount = async (req, res) => {
  try {
    // Get all clinics
    const clinics = await Clinic.findAll();

    for (const clinic of clinics) {
      // Count patients for each clinic
      const patientCount = await Patient.count({
        where: {
          clinic_id: clinic.id,
        },
      });

      // Update clinic table with patient count
      await Clinic.update(
        { patient_count: patientCount },
        { where: { id: clinic.id } }
      );
    }

    logger.info("Patient counts updated successfully");
    res.status(200).json({ message: "Patient counts updated successfully" });
  } catch (error) {
    logger.error("Error updating patient counts", { error });
    res.status(500).json({ message: "Error updating patient counts", error });
  }
};

exports.getClinics = async (req, res) => {
  try {
    const doctorId = req.user.userId; // Assuming userId is stored in req.user after authentication

    // Fetch clinics associated with the doctor
    const clinics = await Clinic.findAll({ where: { doctor_id: doctorId } });

    if (!clinics.length) {
      return res
        .status(404)
        .json({ message: "No clinics found for this doctor" });
    }

    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clinics", error });
  }
};
