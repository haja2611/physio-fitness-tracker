const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");

/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: Operations related to exercises
 */

/**
 * @swagger
 * /exercises:
 *   get:
 *     tags: [Exercises]
 *     summary: Get a list of exercises
 *     description: Returns a list of exercises
 *     responses:
 *       200:
 *         description: A list of exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercise'
 */

/**
 * @swagger
 * /exercises/{id}:
 *   get:
 *     tags: [Exercises]
 *     summary: Get an exercise by ID
 *     description: Returns a single exercise by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the exercise to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Exercise object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: 'src/api/models/ExerciseModel'
 *       404:
 *         description: Exercise not found
 */

// Create a new exercise
router.post("/", exerciseController.createExercise); //ok

// Get all exercises
router.get("/", exerciseController.getExercises); //ok

// Get a specific exercise by ID
router.get("/:id", exerciseController.getExerciseById); //ok

// Update a specific exercise by ID
router.put("/:id", exerciseController.updateExercise);

// Delete a specific exercise by ID
router.delete("/:id", exerciseController.deleteExercise);

module.exports = router;
