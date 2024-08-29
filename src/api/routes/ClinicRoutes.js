const express = require("express");
const router = express.Router();
const clinicController = require("../controllers/clinicController");
const authenticateToken = require("../middleware/auth");
// const authenticateDoctor = require("../middleware/authenticateDoctor");

router.post("/update-patient-count", clinicController.updatePatientCount);
router.post("/", authenticateToken, clinicController.createClinic); //ok
// router.get("/", clinicController.getAllClinics); //ok
// router.get("/:id", clinicController.getClinicById); //ok
router.put("/:id", clinicController.updateClinic); //ok but modify update_date update when put api running
router.delete("/:id", clinicController.deleteClinic); //ok
router.get("/", authenticateToken, clinicController.getClinics);
module.exports = router;
