const express = require("express");
const sessionController = require("../controllers/sessionController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Create a new session
router.post("/", authenticateToken, sessionController.createSession);

// Get all sessions for a specific doctor
router.get("/", authenticateToken, sessionController.getSessionsByDoctor);

// Update a session by ID
router.put("/:id", authenticateToken, sessionController.updateSession);

// Delete a session by ID
router.delete("/:id", authenticateToken, sessionController.deleteSession);

module.exports = router;
