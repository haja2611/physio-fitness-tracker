const express = require("express");
const { Patient } = require("../models1/dataModels"); // Adjust the path as needed
const { PatientNotes } = require("../models1/dataModels");
const { Data } = require("../models1/dataModels");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Create a new patient
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { First_name, Last_name, Exercise_type } = req.body;
    const newPatient = await Patient.create({
      First_name,
      Last_name,
      Exercise_type,
      Created_Date: new Date(),
    });
    res.status(201).json(newPatient);
  } catch (error) {
    console.error("Error adding patient:", error);
    res.status(500).json({ error: "Failed to add patient" });
  }
});

// Get all patients
router.get("/", authenticateToken, async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

// Get a patient by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ error: "Failed to fetch patient" });
  }
});

// Update a patient
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { First_name, Last_name, Exercise_type } = req.body;
    const [updated] = await Patient.update(
      { First_name, Last_name, Exercise_type, Update_date: new Date() },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedPatient = await Patient.findByPk(req.params.id);
      res.json(updatedPatient);
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ error: "Failed to update patient" });
  }
});

// Delete a patient
router.delete("/:id", authenticateToken, async (req, res) => {
  const patientId = req.params.id;
  try {
    // First, delete associated ExerciseData records
    await Data.destroy({ where: { patient_id: patientId } });

    // Then, delete associated PatientNotes records
    await PatientNotes.destroy({ where: { patient_id: patientId } });

    // Finally, delete the patient
    const deleted = await Patient.destroy({ where: { id: patientId } });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ error: "Failed to delete patient" });
  }
});

module.exports = router;
