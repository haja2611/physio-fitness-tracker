const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const authenticateToken = require("../middleware/authenticateToken");

// router.post("/", patientController.createPatient); //ok
// Set password route
router.post("/set-password", patientController.setPassword); //ok
router.post("/", authenticateToken, patientController.createPatient);
// Resend password setup link
router.post(
  "/resend-password-setup-link",
  patientController.resendPasswordSetupLink
); //ok

// Login route
// router.post('/login', patientController.login);
router.put("/:id", authenticateToken, patientController.updatePatient); //notok because updated time is not updated
router.delete("/:id", authenticateToken, patientController.deletePatient); //ok
// router.get("/", authenticateToken, patientController.getPatients); //ok
// router.get("/:id", authenticateToken, patientController.getPatientById); //ok

router.get(
  "/:clinic_id/patients",
  authenticateToken,
  patientController.getPatientsByClinic
);
router.get("/", authenticateToken, patientController.getPatientsByDoctor);
module.exports = router;
