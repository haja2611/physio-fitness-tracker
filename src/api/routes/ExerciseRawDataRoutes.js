const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const {
  createExerciseRawData,
  getExerciseRawDataByDoctor,
  getExerciseRawDataByPatient,
  deleteExerciseRawData,
} = require("../controllers/exerciseRawDataController");

// Create Exercise Raw Data
router.post("/", createExerciseRawData);

// Get Exercise Raw Data by doctor_id
router.get("/", authenticateToken, getExerciseRawDataByDoctor);

// Get Exercise Raw Data by patient_id
router.get(
  "/:patient_id/:date",
  authenticateToken,
  getExerciseRawDataByPatient
);

// Delete Exercise Raw Data by ID
router.delete("/:id", authenticateToken, deleteExerciseRawData);

module.exports = router;
