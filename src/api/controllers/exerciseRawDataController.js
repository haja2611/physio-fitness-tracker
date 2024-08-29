const ExerciseRawData = require("../models/ExerciseRawDataModel");

const createExerciseRawData = async (req, res) => {
  try {
    const {
      doctor_id,
      patient_id,
      exercise_id,
      device_id,
      timestamp,
      x,
      y,
      z,
      x_angle,
      y_angle,
      z_angle,
    } = req.body;
    const newEntry = await ExerciseRawData.create({
      doctor_id,
      patient_id,
      exercise_id,
      device_id,
      timestamp,
      x,
      y,
      z,
      x_angle,
      y_angle,
      z_angle,
    });

    res.status(201).json(newEntry);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating exercise raw data", error });
  }
};
// const createExerciseRawData = async (req, res) => {
//   try {
//     const doctorId = req.user.userId;

//     await ExerciseRawData.create({
//       ...req.body,
//       doctor_id: doctorId,
//     });

//     res.status(201);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error creating exercise raw data", error });
//   }
// };

// const getExerciseRawData = async (req, res) => {
//   try {

//     const { id } = req.params;

//     const rawData = await ExerciseRawData.findOne({
//       where: {
//         id,
//         doctor_id: req.doctor_id, // Assuming doctor_id should match
//       },
//     });

//     if (!rawData) {
//       return res.status(404).json({ message: 'Data not found' });
//     }

//     res.status(200).json(rawData);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching exercise raw data', error });
//   }
// };

// Get all Exercise Raw Data by doctor_id
const getExerciseRawDataByDoctor = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const rawData = await ExerciseRawData.findAll({
      where: {
        doctor_id: doctorId,
      },
    });

    if (!rawData || rawData.length === 0) {
      return res.status(404).json({ message: "No data found for this doctor" });
    }

    res.status(200).json(rawData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching exercise raw data", error });
  }
};

// Get Exercise Raw Data by patient_id
const getExerciseRawDataByPatient = async (req, res) => {
  try {
    const doctorId = req.user.userId;

    const { patient_id, date } = req.params;

    const rawData = await ExerciseRawData.findAll({
      where: {
        patient_id,
        doctor_id: doctorId,
        date_only: date,
      },
    });

    if (!rawData || rawData.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for this patient" });
    }

    res.status(200).json(rawData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching exercise raw data", error });
  }
};

// Delete Exercise Raw Data by ID
const deleteExerciseRawData = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteCount = await ExerciseRawData.destroy({
      where: {
        id,
        doctor_id: req.doctor_id,
      },
    });

    if (deleteCount === 0) {
      return res
        .status(404)
        .json({ message: "Data not found or not authorized" });
    }

    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting exercise raw data", error });
  }
};

module.exports = {
  createExerciseRawData,
  getExerciseRawDataByDoctor,
  getExerciseRawDataByPatient,
  deleteExerciseRawData,
};
