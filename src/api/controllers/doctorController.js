// controllers/doctorController.js
const s3 = require("../config/aws");
const Doctor = require("../models/DoctorModel");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

const uploadProfilePicture = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get the current profile picture URL from the database
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // If there is an existing profile picture, delete it from S3
    if (doctor.profile) {
      const existingKey = doctor.profile.split(".com/")[1];
      await s3
        .deleteObject({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: existingKey,
        })
        .promise();
    }

    // Define the parameters for S3 upload, including the bucket name and file key
    const params = {
      Bucket: process.env.AWS_S3_BUCKET, // Specify the bucket name here
      Key: `profile-pictures/${uuidv4()}-${file.originalname}`, // Path within the bucket
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // Make the file publicly accessible
    };

    // Upload the file to S3
    const s3Response = await s3.upload(params).promise();

    // Update the Doctor's profile field with the new S3 file URL
    doctor.profile = s3Response.Location;
    await doctor.save();

    res.status(200).json({
      message: "Profile picture uploaded/updated successfully",
      profileUrl: s3Response.Location,
      doctor: doctor,
    });
  } catch (error) {
    console.error(error);
    logger.error(error);
    res.status(500).json({ error: "Error uploading/updating profile picture" });
  }
};

const removeProfilePicture = async (req, res) => {
  try {
    const doctorId = req.user.userId;

    // Get the current profile picture URL from the database
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    if (doctor.profile) {
      const existingKey = doctor.profile.split(".com/")[1];

      // Delete the profile picture from S3
      await s3
        .deleteObject({ Bucket: process.env.AWS_S3_BUCKET, Key: existingKey })
        .promise();

      // Set the profile field to null in the database
      doctor.profile = null;
      await doctor.save();

      res.status(200).json({
        message: "Profile picture removed successfully",
        doctor: doctor,
      });
    } else {
      res.status(400).json({ error: "No profile picture to remove" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error removing profile picture" });
  }
};

const getProfilePicture = async (req, res) => {
  try {
    const doctorId = req.user.userId;

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    if (!doctor.profile) {
      return res.status(404).json({ error: "No profile picture found" });
    }

    res.status(200).json({ profileUrl: doctor.profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching profile picture" });
  }
};

module.exports = {
  uploadProfilePicture,
  removeProfilePicture,
  getProfilePicture,
};
