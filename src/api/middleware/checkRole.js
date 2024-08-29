const UserRole = require("../models/UserRoleModel");

const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    const { userId, userType } = req.user; // Assuming user information is stored in req.user after authentication
    const userRole = await UserRole.findOne({
      where: { user_id: userId, user_type: userType },
    });

    if (userRole && userRole.role === requiredRole) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};

module.exports = checkRole;
