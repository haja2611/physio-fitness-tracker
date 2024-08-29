const express = require("express");
const { ExerciseData } = require("../models1/dataModels"); // Adjust the path as needed
const { Op } = require("sequelize");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
// Create a new exercise data entry
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { patient_id, hash_key, exercise_id, x, y, z, date } = req.body;
    const newExerciseData = await ExerciseData.create({
      patient_id,
      hash_key,
      exercise_id,
      x,
      y,
      z,
      date,
    });
    res.status(201).json(newExerciseData);
  } catch (error) {
    console.error("Error adding exercise data:", error);
    res.status(500).json({ error: "Failed to add exercise data" });
  }
});

// Get all exercise data entries
router.get("/", authenticateToken, async (req, res) => {
  try {
    const exerciseDataEntries = await ExerciseData.findAll();
    res.json(exerciseDataEntries);
  } catch (error) {
    console.error("Error fetching exercise data:", error);
    res.status(500).json({ error: "Failed to fetch exercise data" });
  }
});

// Get an exercise data entry by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const exerciseDataEntry = await ExerciseData.findByPk(req.params.id);
    if (exerciseDataEntry) {
      res.json(exerciseDataEntry);
    } else {
      res.status(404).json({ error: "Exercise data not found" });
    }
  } catch (error) {
    console.error("Error fetching exercise data:", error);
    res.status(500).json({ error: "Failed to fetch exercise data" });
  }
});

// Fetch exercise data by patient ID
router.get("/patient/:patientId", authenticateToken, async (req, res) => {
  try {
    const exerciseData = await ExerciseData.findAll({
      where: { patient_id: req.params.patientId },
    });
    res.json(exerciseData);
  } catch (error) {
    console.error("Error fetching exercise data by patient ID:", error);
    res.status(500).json({ error: "Failed to fetch exercise data" });
  }
});

router.get("/:patientId/:date", authenticateToken, async (req, res) => {
  try {
    const { patientId, date } = req.params;

    // Split the date into year, month, and day
    const [year, month, day] = date.split("-");
    // Create a Date object with the date passed from the API and set the time to the end of the day
    const endDate = new Date(year, month - 1, day, 23, 59, 59);

    // Format the start date to include timestamp for the beginning of the day
    const startDate = new Date(year, month - 1, day);

    const exerciseData = await ExerciseData.findAll({
      where: {
        patient_id: patientId,
        date: {
          // Use Sequelize Op.between to query between the start and end of the day
          [Op.between]: [new Date(date), endDate],
        },
      },
    });
    res.json(exerciseData);
  } catch (error) {
    console.error(
      "Error fetching exercise data by patient ID and date:",
      error
    );
    res.status(500).json({ error: "Failed to fetch exercise data" });
  }
});

// Update an exercise data entry
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { patient_id, hash_key, exercise_id, x, y, z, date, timestamp } =
      req.body;
    const [updated] = await ExerciseData.update(
      { patient_id, hash_key, exercise_id, x, y, z, date, timestamp },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedExerciseDataEntry = await ExerciseData.findByPk(
        req.params.id
      );
      res.json(updatedExerciseDataEntry);
    } else {
      res.status(404).json({ error: "Exercise data not found" });
    }
  } catch (error) {
    console.error("Error updating exercise data:", error);
    res.status(500).json({ error: "Failed to update exercise data" });
  }
});

// Delete an exercise data entry
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await ExerciseData.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Exercise data not found" });
    }
  } catch (error) {
    console.error("Error deleting exercise data:", error);
    res.status(500).json({ error: "Failed to delete exercise data" });
  }
});

module.exports = router;
