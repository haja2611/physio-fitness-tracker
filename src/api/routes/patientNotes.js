const express = require("express");
const { PatientNotes } = require("../models1/dataModels");

const router = express.Router();

// Create a new patient note
router.post("/", async (req, res) => {
  try {
    const { patient_id, exercise_id, Status, Description } = req.body;
    const newPatientNote = await PatientNotes.create({
      patient_id,
      exercise_id,
      Created_Date: new Date(),
      Status,
      Description,
    });
    res.status(201).json(newPatientNote);
  } catch (error) {
    console.error("Error adding patient note:", error);
    res.status(500).json({ error: "Failed to add patient note" });
  }
});

// Get all patient notes
router.get("/", async (req, res) => {
  try {
    const patientNotes = await PatientNotes.findAll();
    res.json(patientNotes);
  } catch (error) {
    console.error("Error fetching patient notes:", error);
    res.status(500).json({ error: "Failed to fetch patient notes" });
  }
});

// Get a patient note by ID
router.get("/:id", async (req, res) => {
  try {
    const patientNote = await PatientNotes.findByPk(req.params.id);
    if (patientNote) {
      res.json(patientNote);
    } else {
      res.status(404).json({ error: "Patient note not found" });
    }
  } catch (error) {
    console.error("Error fetching patient note:", error);
    res.status(500).json({ error: "Failed to fetch patient note" });
  }
});

// Update a patient note
router.put("/:id", async (req, res) => {
  try {
    const { patient_id, exercise_id, Status, Description } = req.body;
    const [updated] = await PatientNotes.update(
      { patient_id, exercise_id, Update_date: new Date(), Status, Description },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedPatientNote = await PatientNotes.findByPk(req.params.id);
      res.json(updatedPatientNote);
    } else {
      res.status(404).json({ error: "Patient note not found" });
    }
  } catch (error) {
    console.error("Error updating patient note:", error);
    res.status(500).json({ error: "Failed to update patient note" });
  }
});

// Delete a patient note
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await PatientNotes.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Patient note not found" });
    }
  } catch (error) {
    console.error("Error deleting patient note:", error);
    res.status(500).json({ error: "Failed to delete patient note" });
  }
});

module.exports = router;
