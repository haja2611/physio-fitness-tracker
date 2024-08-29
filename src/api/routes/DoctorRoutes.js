// routes/doctor.js
const express = require("express");
const multer = require("multer");
const {
  uploadProfilePicture,
  removeProfilePicture,
  getProfilePicture,
} = require("../controllers/doctorController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Configure multer storage and file filter
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG and JPG files are allowed"), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post(
  "/upload-profile",
  authenticateToken,
  upload.single("profile"),
  uploadProfilePicture
);

router.delete("/remove-profile", authenticateToken, removeProfilePicture);
router.get("/profile-picture", authenticateToken, getProfilePicture);

module.exports = router;
