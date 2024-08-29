const express = require('express');
const router = express.Router();
const roleController = require('../controllers/userRoleController');
const checkRole = require('../middleware/checkRole');


// Example route only accessible by doctors
router.post('/roles', checkRole('doctor'), roleController.assignRole);
// Example route only accessible by patients
router.get('/roles', checkRole('patient'), roleController.getRoles);


module.exports = router;
