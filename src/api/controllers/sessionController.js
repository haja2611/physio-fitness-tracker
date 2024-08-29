const Session = require("../models/SessionModel");
const logger = require("../utils/logger");

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const doctorId = req.user.userId;

    // Create session with doctor_id verification
    const session = await Session.create({
      ...req.body,
      doctor_id: doctorId,
    });
    logger.info("Session Created Successfully", { session });
    res.status(201).json({ message: "Session created successfully", session });
  } catch (error) {
    logger.error("Error Creating Session"), { error };
    res.status(500).json({ error: error.message });
  }
};

// Get all sessions for a specific doctor
exports.getSessionsByDoctor = async (req, res) => {
  try {
    const doctorId = req.user.userId;

    const sessions = await Session.findAll({
      where: { doctor_id: doctorId },
    });
    if (!sessions.length) {
      return res
        .status(404)
        .json({ message: "No sessions found for this doctor" });
    }

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a session
exports.updateSession = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { id } = req.params;

    const session = await Session.findOne({
      where: { id: id, doctor_id: doctorId },
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found or you are not authorized" });
    }

    const updatedSession = await session.update(req.body);

    res.status(200).json({
      message: "Session updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a session
exports.deleteSession = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { id } = req.params;

    const session = await Session.findOne({
      where: { id: id, doctor_id: doctorId },
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found or you are not authorized" });
    }

    await session.destroy();

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
