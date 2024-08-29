require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./utils/sequelize"); // Adjust the path as needed
const logger = require("./utils/logger");
const authRoutes = require("./routes/auth");
// const patientdataRoutes = require("./routes/patient");
// const exerciseRoutes = require("./routes/exercise");
// const exerciseDataRoutes = require("./routes/exerciseData");
// const patientNotesRoutes = require("./routes/patientNotes");
const clinicRoutes = require("./routes/ClinicRoutes");
const patientRoutes = require("./routes/PatientRoutes");
const roleRoutes = require("./routes/UserRoleRoutes");
const exerciseRoutes = require("./routes/ExerciseRoutes");
const doctorRoutes = require("./routes/DoctorRoutes");
const deviceRoutes = require("./routes/DeviceRoutes");
const sessionRoutes = require("./routes/SessionRoutes");
const ExerciseRawDataRoutes = require("./routes/ExerciseRawDataRoutes");
const { swaggerUi, specs } = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000/", // Replace with your Vite server's URL
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Serve Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/patients", patientdataRoutes);
// app.use("/api/exercises", exerciseRoutes);
// app.use("/api/exerciseData", exerciseDataRoutes);
// app.use("/api/patientNotes", patientNotesRoutes);
app.use("/api/clinic", clinicRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/user", roleRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/exercise-raw-data", ExerciseRawDataRoutes);
//middleware to log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

// Sync database and load data if not already loaded
sequelize
  .sync({ alter: true }) // Set to true only during development
  .then(async () => {
    logger.info("Database synchronized");

    // Load data only if the table is empty
    // const count = await Data.count();
    // if (count === 0) {
    //   await insertData();
    // }

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Server is running on http://localhost:${PORT}`);
      logger.info(
        `Swagger docs are available at http://localhost:${PORT}/api-docs`
      );
    });
  })
  .catch((err) => logger.error("Error synchronizing the database:", err));

module.exports = app;
