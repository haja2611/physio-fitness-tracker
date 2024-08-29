const express = require("express");
const { Exercise } = require("../models1/dataModels"); // Adjust the path as needed
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Create a new exercise
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { Name, Description, Status } = req.body;
    const newExercise = await Exercise.create({
      Name,
      Description,
      Created_Date: new Date(),
      Status,
    });
    res.status(201).json(newExercise);
  } catch (error) {
    console.error("Error adding exercise:", error);
    res.status(500).json({ error: "Failed to add exercise" });
  }
});

// Get all exercises
router.get("/", authenticateToken, async (req, res) => {
  try {
    const exercises = await Exercise.findAll();
    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
});

// Get an exercise by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);
    if (exercise) {
      res.json(exercise);
    } else {
      res.status(404).json({ error: "Exercise not found" });
    }
  } catch (error) {
    console.error("Error fetching exercise:", error);
    res.status(500).json({ error: "Failed to fetch exercise" });
  }
});

// Update an exercise
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { Name, Description, Status } = req.body;
    const [updated] = await Exercise.update(
      { Name, Description, Update_date: new Date(), Status },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedExercise = await Exercise.findByPk(req.params.id);
      res.json(updatedExercise);
    } else {
      res.status(404).json({ error: "Exercise not found" });
    }
  } catch (error) {
    console.error("Error updating exercise:", error);
    res.status(500).json({ error: "Failed to update exercise" });
  }
});

// Delete an exercise
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Exercise.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Exercise not found" });
    }
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({ error: "Failed to delete exercise" });
  }
});

module.exports = router;
