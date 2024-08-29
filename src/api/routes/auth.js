const express = require("express");
const jwt = require("jsonwebtoken");
// const { User } = require("../models1/user"); // Ensure this is the correct path to your models
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserRole = require("../models/UserRoleModel");
const Doctor = require("../models/DoctorModel");
const Patient = require("../models/PatientModel");
const nodemailer = require("nodemailer");
const { Sequelize } = require("sequelize");
const logger = require("../utils/logger");

require("dotenv").config();
const router = express.Router();

// Utility function to send email
async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
// Register
// router.post("/register", async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "User already exists with this email." });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//     });
//     res.status(201).json({ message: "User registered successfully." });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// Login a user
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password." });
//     }
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password." });
//     }
//     const token = jwt.sign({ author: user.username }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.post("/register", async (req, res) => {
  const { first_name, last_name, phonenumber, emailid, password } = req.body;
  try {
    const existingUser = await Doctor.findOne({ where: { emailid } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      first_name,
      last_name,
      emailid,
      phonenumber,
      password: hashedPassword,
    });
    // Assign role to patient
    await UserRole.create({
      user_id: doctor.id,
      user_type: "doctor",
      role: "doctor",
    });
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailid, password } = req.body;

    // Authenticate user (example with JWT)
    const user = await authenticateUser(emailid, password);

    if (!user) {
      logger.warn("Invalid credentials attempt for email:", emailid);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Retrieve the user's role
    const userRole = await UserRole.findOne({
      where: { user_id: user.id },
    });

    if (!userRole) {
      logger.warn(`Role not found for user id: ${user.id}`);
      return res.status(404).json({ message: "Role not found" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, userType: userRole.user_type },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Define redirect URL based on role
    let redirectUrl = "/dashboard"; // Default redirect
    if (userRole.role === "doctor") {
      redirectUrl = "/dashboard";
    } else if (userRole.role === "patient") {
      redirectUrl = "/patient-dashboard";
    }
    // Respond with token and role
    logger.info(`User ${emailid} logged in successfully.`);
    // Respond with token and role
    res.status(200).json({
      message: "Login successful",
      token,
      role: userRole.role,
      redirectUrl,
    });
  } catch (error) {
    logger.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Authenticate user function (example)
const authenticateUser = async (emailid, password) => {
  try {
    const user =
      (await Doctor.findOne({ where: { emailid } })) ||
      (await Patient.findOne({ where: { emailid } }));

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  } catch (error) {
    logger.error("Error in authenticateUser:", error); // Log the error using Winston
    throw new Error("Authentication failed");
  }
};

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { emailid } = req.body;
  try {
    const doctor = await Doctor.findOne({ where: { emailid } });
    const patient = await Patient.findOne({ where: { emailid } });

    if (!doctor && !patient) {
      return res.status(400).send("No user found with this email.");
    }

    const user = doctor || patient; // The user will be either doctor or patient
    const otp = crypto.randomInt(100000, 999999).toString();
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.update({
      password_reset_token: otp,
      password_reset_expires: expirationTime,
    });

    await user.save();
    const resetOtp = `${otp}`;
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                     Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
                     ${resetOtp}\n\n
                     If you did not request this, please ignore this email and your password will remain unchanged.\n`;
    await sendEmail(user.email, "Password Reset OTP", message);
    res.status(200).send("Password reset OTP sent your email");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending password reset OTP");
  }
});

// Reset Password
router.post("/reset-password/:otp", async (req, res) => {
  const { otp } = req.params;
  const { password, confirm_password } = req.body;
  try {
    const doctor = await Doctor.findOne({
      where: {
        password_reset_token: otp,
        password_reset_expires: { [Sequelize.Op.gt]: Date.now() },
      },
    });
    const patient = await Patient.findOne({
      where: {
        password_reset_token: otp,
        password_reset_expires: { [Sequelize.Op.gt]: Date.now() },
      },
    });
    const user = doctor || patient;
    if (!user) {
      return res
        .status(400)
        .send("Password reset token is invalid or has expired");
    }
    if (password !== confirm_password) {
      return res.status(400).send("Passwords do not match");
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send(
          "Password must be at least 8 characters long and contain at least one letter and one number"
        );
    }
    user.password = await bcrypt.hash(password, 10);
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save();
    res.status(200).send("Password has been reset");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error resetting password");
  }
});
module.exports = router;
