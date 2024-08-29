const express = require("express");
const deviceController = require("../controllers/deviceController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Get all devices
router.get("/", authenticateToken, deviceController.getAllDevices);

// Get a single device by ID
router.get("/:id", authenticateToken, deviceController.getDeviceById);

// Create a new device
router.post("/", authenticateToken, deviceController.createDevice);

// Update an existing device
router.put("/:id", authenticateToken, deviceController.updateDevice);

// Delete a device
router.delete("/:id", authenticateToken, deviceController.deleteDevice);

module.exports = router;
