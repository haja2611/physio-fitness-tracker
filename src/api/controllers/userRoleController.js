const UserRole = require("../models/UserRoleModel");
const logger = require("../utils/logger");

exports.assignRole = async (req, res) => {
  try {
    const { user_id, user_type, role } = req.body;
    const userRole = await UserRole.create({ user_id, user_type, role });
    logger.info("Role assigned successfully", { userRole });
    res.status(201).json(userRole);
  } catch (error) {
    logger.error("Error assigning role", { error });
    res.status(500).json({ message: "Error assigning role", error });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await UserRole.findAll();
    res.status(200).json(roles);
  } catch (error) {
    logger.error("Error fetching roles", { error });
    res.status(500).json({ message: "Error fetching roles", error });
  }
};
