const Exercise = require("../models/ExerciseModel");
const logger = require("../utils/logger");

exports.createExercise = async (req, res) => {
  try {
    const exerciseData = req.body;
    const exercise = await Exercise.create(exerciseData);
    logger.info("Exercise created successfully", { exercise });
    res
      .status(201)
      .json({ message: "Exercise created successfully", exercise });
  } catch (error) {
    logger.error("Error creating exercise", { error });
    res.status(500).json({ message: "Error creating exercise", error });
  }
};

exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll();
    res.status(200).json(exercises);
  } catch (error) {
    logger.error("Error fetching exercises", { error });
    res.status(500).json({ message: "Error fetching exercises", error });
  }
};

exports.getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByPk(id);
    if (exercise) {
      res.status(200).json(exercise);
    } else {
      res.status(404).json({ message: "Exercise not found" });
    }
  } catch (error) {
    logger.error("Error fetching exercise", { error });
    res.status(500).json({ message: "Error fetching exercise", error });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Exercise.update(req.body, {
      where: { id },
    });
    if (updated[0] > 0) {
      const updatedExercise = await Exercise.findByPk(id);
      logger.info("Exercise updated successfully", { updatedExercise });
      res.status(200).json(updatedExercise);
    } else {
      res.status(404).json({ message: "Exercise not found" });
    }
  } catch (error) {
    logger.error("Error updating exercise", { error });
    res.status(500).json({ message: "Error updating exercise", error });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Exercise.destroy({
      where: { id },
    });
    if (deleted) {
      logger.info("Exercise deleted successfully", { exerciseId: id });
      res.status(200).json({ message: "Exercise deleted successfully" });
    } else {
      res.status(404).json({ message: "Exercise not found" });
    }
  } catch (error) {
    logger.error("Error deleting exercise", { error });
    res.status(500).json({ message: "Error deleting exercise", error });
  }
};
