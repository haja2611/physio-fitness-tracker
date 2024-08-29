const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const ExerciseRawData = require("./models/ExerciseRawDataModel");
require("dotenv").config();

const csvFilePath = path.join(__dirname, "./Excel/6050_exec1_colDB.csv");
const outputDir = path.join(__dirname, "./output");
const outputFilePath = path.join(outputDir, "loadedData.json");

const loadCSVData = async () => {
  const results = [];

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Create a write stream for the output file
  const writeStream = fs.createWriteStream(outputFilePath);
  writeStream.write("[");

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const timestamps = Object.keys(results[0]);

        for (const timestamp of timestamps) {
          for (let i = 0; i < results.length; i += 6) {
            const dataToInsert = {
              doctor_id: "fa2def01-5dbd-46a1-990e-19981a92f18a",
              patient_id: "f0b2f087-6698-48d9-bf82-98a89d30b2f1",
              exercise_id: "dab80e99-6bcc-40e6-9bb3-0c2924342970",
              device_id: "28461b5d-dbc2-448a-a008-776f12b31c8e",
              timestamp: new Date(timestamp),
              date_only: new Date(timestamp).toISOString().split("T")[0],
              x: parseFloat(results[i][timestamp]),
              y: parseFloat(results[i + 1][timestamp]),
              z: parseFloat(results[i + 2][timestamp]),
              x_angle: parseFloat(results[i + 3][timestamp]),
              y_angle: parseFloat(results[i + 4][timestamp]),
              z_angle: parseFloat(results[i + 5][timestamp]),
            };

            try {
              // Insert the data into the database
              await ExerciseRawData.create(dataToInsert);
              // Log successful insert
              console.log("Inserted data:", dataToInsert);
            } catch (dbError) {
              // Log errors during database operations
              console.error("Error inserting data:", dataToInsert, dbError);
            }

            // Write the data to the file
            writeStream.write(JSON.stringify(dataToInsert) + ",\n");
          }
        }

        // End the JSON array in the file
        writeStream.write("]");
        writeStream.end();

        console.log(
          "Data successfully loaded into PostgreSQL and stored in output file!"
        );
      } catch (error) {
        console.error("Error loading data:", error);
        writeStream.end();
      }
    });
};

loadCSVData();
