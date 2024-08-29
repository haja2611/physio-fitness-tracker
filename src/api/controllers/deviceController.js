const Device = require("../models/DeviceModel");
const logger = require("../utils/logger");

// Get all devices
exports.getAllDevices = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const devices = await Device.findAll({ where: { doctor_id: doctorId } });
    if (!devices.length) {
      return res
        .status(404)
        .json({ message: "No devices found for this doctor" });
    }

    res.status(200).json(devices);
    logger.info("Devices get successfully", { devices });
  } catch (error) {
    logger.error("Failed to retrieve devices:", error);
    res.status(500).json({ error: "Failed to retrieve devices" });
  }
};

// Get a single device by ID
exports.getDeviceById = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await Device.findByPk(id);
    if (device) {
      res.status(200).json(device);
    } else {
      res.status(404).json({ error: "Device not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve device" });
  }
};

// Create a new device
exports.createDevice = async (req, res) => {
  try {
    // Get the doctor_id from the authenticated user
    const doctorId = req.user.userId;
    const newDevice = await Device.create({
      ...req.body,
      doctor_id: doctorId,
    });
    logger.info("Device created successfully", { newDevice });
    res.status(201).json(newDevice);
  } catch (error) {
    logger.error("Error creating clinic", { error });
    res.status(500).json({ error: "Failed to create device" });
  }
};

// Update an existing device
exports.updateDevice = async (req, res) => {
  const { id } = req.params;
  const { device_type, capabilities, current_load, authorized } = req.body;
  try {
    const device = await Device.findByPk(id);
    if (device) {
      device.device_type = device_type;
      device.capabilities = capabilities;
      device.current_load = current_load;
      device.authorized = authorized;
      await device.save();
      res.status(200).json(device);
    } else {
      res.status(404).json({ error: "Device not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update device" });
  }
};

// Delete a device
exports.deleteDevice = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await Device.findByPk(id);
    if (device) {
      await device.destroy();
      res.status(204).json(); // No content
    } else {
      res.status(404).json({ error: "Device not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete device" });
  }
};
