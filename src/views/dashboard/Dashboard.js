import React, { useState, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import { useAuth } from "../../services/AuthProvider";
import "react-datepicker/dist/react-datepicker.css";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { Modal, Button, Form, FormGroup, FormLabel } from "react-bootstrap";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
// } from "chart.js";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = ({ patientId, date }) => {
  const [session, setSession] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [patients, setPatients] = useState([]);
  const [device, setDevicves] = useState([]);
  const [exercise, setExercise] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPatientList, setShowPatientList] = useState(false);
  const [showCalender, setShowCalender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseRawData, setExerciseRawData] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const {
    getSessionByDoctor,
    getExercises,
    getClinicsForDoctor,
    getDevicesByDoctor,
    getPatientsByDoctor,
    getExerciseRawDataByPatient,
  } = useAuth();

  useEffect(() => {
    getPatientsByDoctor().then((data) => setPatients(data));
    getSessionByDoctor().then((data) => setSession(data));
    getExercises().then((data) => setExercise(data));
    getDevicesByDoctor().then((data) => setDevicves(data));
    getClinicsForDoctor().then((data) => setClinics(data));
  }, [
    getSessionByDoctor,
    getExercises,
    getClinicsForDoctor,
    getDevicesByDoctor,
    getPatientsByDoctor,
  ]);

  const getClinicName = (clinicId) => {
    const clinicItem = clinics.find((clinic) => clinic.id === clinicId);
    return clinicItem ? clinicItem.name : "Unknown Clinic";
  };

  const getDeviceName = (deviceId) => {
    const deviceItem = device.find((device) => device.id === deviceId);
    return deviceItem ? deviceItem.device_type : "Unknown Device";
  };

  const getExerciseName = (exerciseId) => {
    const exerciseItem = exercise.find(
      (exercise) => exercise.id === exerciseId
    );
    return exerciseItem ? exerciseItem.name : "Unknown Exercise";
  };

  const getPatientName = (patientId) => {
    const patient = patients.find((patient) => patient.id === patientId);
    return patient
      ? `${patient.first_name} ${patient.last_name}`
      : "Unknown Patient";
  };

  const filteredSession = useMemo(() => {
    return session.filter((s) => {
      const patientName = getPatientName(s.patient_id).toLowerCase();
      const clinicName = getClinicName(s.clinic_id).toLowerCase();
      const exerciseName = getExerciseName(s.exercise_id).toLowerCase();
      return (
        patientName.includes(searchQuery.toLowerCase()) ||
        clinicName.includes(searchQuery.toLowerCase()) ||
        exerciseName.includes(searchQuery.toLowerCase())
      );
    });
  }, [session, searchQuery]);

  const formatDate = (dateString) => {
    if (!dateString) {
      console.error("No date string provided");
      return "Invalid date";
    }
    console.log("Original date string:", dateString);
    const date = new Date(dateString);
    console.log("Parsed date object:", date);
    if (isNaN(date)) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const handleDateChange = async (date) => {
    const formattedDate = formatDate(date);

    setSelectedDate(formattedDate);
    console.log("selected date:", selectedDate);
    handleCloseCalender();
    // if (selectedPatientId) {
    //   const data = await getExerciseRawDataByPatient(selectedPatientId, date);
    //   setExerciseRawData(data);
    // }
  };

  const handleCloseCalender = () => {
    setShowCalender(false);
  };

  const handlePatientListClick = () => {
    setShowPatientList(!showPatientList);
  };

  const handleShowModal = (sessionId, patientId) => {
    setSelectedPatientId(patientId);
    console.log("Selected Patient ID:", patientId);
    setSelectedSessionId(sessionId);
    setShowModal(true);
  };
  const handleDateSubmitModal = (selectedPatientId, formattedDate) => {
    console.log("Selected Patient ID:", selectedPatientId);
    console.log("Selected Date:", formattedDate);
    if (!selectedPatientId || !formattedDate) {
      console.error("Patient ID or date is missing");
      return;
    }
    // Fetch the data after closing the modal
    getExerciseRawDataByPatient(selectedPatientId, formattedDate)
      .then((data) => setExerciseRawData(data))
      .catch((error) =>
        console.error("Error fetching exercise raw data:", error)
      );
    // setSelectedPatientId(selectedPatientId);
    // setSelectedDate(formattedDate);
    handleCloseModal();
  };

  const handleCloseModal = () => setShowModal(false);
  const graphData = exerciseRawData.map((data) => ({
    time: new Date(data.timestamp).toLocaleTimeString(),
    x_angle: data.x_angle,
    y_angle: data.y_angle,
    z_angle: data.z_angle,
  }));
  // const chartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: "top",
  //       labels: {
  //         usePointStyle: true, // Use point style for legend
  //         font: {
  //           size: 14,
  //         },
  //       },
  //     },
  //     tooltip: {
  //       callbacks: {
  //         title: function (tooltipItems) {
  //           // Ensure timestamp is correctly accessed
  //           const index = tooltipItems[0].dataIndex;
  //           if (exerciseRawData[index]) {
  //             const timestamp = new Date(
  //               exerciseRawData[index].timestamp
  //             ).toLocaleString();
  //             return `Timestamp: ${timestamp}`;
  //           }
  //           return "Timestamp: N/A";
  //         },

  //         label: function (tooltipItem) {
  //           const datasetLabel = tooltipItem.dataset.label || "";
  //           const value = tooltipItem.raw;
  //           const index = tooltipItem.dataIndex;
  //           if (exerciseRawData[index]) {
  //             const dataPoint = exerciseRawData[index];
  //             return [
  //               `${datasetLabel}: ${value}`,
  //               `X Angle: ${dataPoint.x_angle}`,
  //               `Y Angle: ${dataPoint.y_angle}`,
  //               `Z Angle: ${dataPoint.z_angle}`,
  //               `X: ${dataPoint.x}`,
  //               `Y: ${dataPoint.y}`,
  //               `Z: ${dataPoint.z}`,
  //             ].join("\n");
  //           }
  //           return `${datasetLabel}: ${value}`;
  //         },
  //       },
  //     },
  //   },
  //   scales: {
  //     x: {
  //       title: {
  //         display: true,
  //         text: "Time",
  //       },
  //     },
  //     y: {
  //       title: {
  //         display: true,
  //         text: "Angle",
  //       },
  //     },
  //   },
  // };
  // // Data preparation for the graph
  // const graphData = {
  //   labels: exerciseRawData.map((data) =>
  //     new Date(data.timestamp).toLocaleTimeString()
  //   ),
  //   datasets: [
  //     {
  //       label: "X Angle",
  //       data: exerciseRawData.map((data) => data.x_angle),
  //       borderColor: "rgba(75, 192, 192, 1)",
  //       backgroundColor: "rgba(75, 192, 192, 0.2)",
  //       fill: false,
  //     },
  //     {
  //       label: "Y Angle",
  //       data: exerciseRawData.map((data) => data.y_angle),
  //       borderColor: "rgba(153, 102, 255, 1)",
  //       backgroundColor: "rgba(153, 102, 255, 0.2)",
  //       fill: false,
  //     },
  //     {
  //       label: "Z Angle",
  //       data: exerciseRawData.map((data) => data.z_angle),
  //       borderColor: "rgba(255, 159, 64, 1)",
  //       backgroundColor: "rgba(255, 159, 64, 0.2)",
  //       fill: false,
  //     },
  //   ],
  // };

  return (
    <>
      <CRow>
        <CCol sm={6}>
          <CCard className="mb-4">
            <CCardHeader>Sessions Overview</CCardHeader>
            <CCardBody>{/* <MainChart /> */}</CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>Sessions</CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between">
                <CButton color="primary" onClick={handlePatientListClick}>
                  Patients List
                </CButton>
                <div>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {showPatientList && (
                <CTable striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Patient Name</CTableHeaderCell>
                      <CTableHeaderCell>Clinic</CTableHeaderCell>
                      <CTableHeaderCell>Exercise</CTableHeaderCell>
                      <CTableHeaderCell>Description</CTableHeaderCell>
                      <CTableHeaderCell>Device</CTableHeaderCell>
                      <CTableHeaderCell>Start Date</CTableHeaderCell>
                      <CTableHeaderCell>End Date</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredSession.length > 0 ? (
                      filteredSession.map((session, index) => (
                        <CTableRow key={session.id || index}>
                          <CTableDataCell>
                            {getPatientName(session.patient_id)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {getClinicName(session.clinic_id)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {getExerciseName(session.exercise_id)}
                          </CTableDataCell>
                          <CTableDataCell>{session.description}</CTableDataCell>
                          <CTableDataCell>
                            {getDeviceName(session.device_id)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formatDate(session.start_date)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formatDate(session.end_date)}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              onClick={() =>
                                handleShowModal(session.id, session.patient_id)
                              }
                            >
                              Date
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="8" className="text-center">
                          No Session found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>Exercise Angles Graph</CCardHeader>
            <CCardBody style={{ height: "500px" }}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={graphData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="x_angle" stroke="#8884d8" />
                  <Line type="monotone" dataKey="y_angle" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="z_angle" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
              {/* <Line
                data={graphData}
                options={chartOptions}
                height={500} // Adjust height as needed
              /> */}
              {/* <Line
                data={graphData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    tooltip: {
                      callbacks: {
                        label: function (tooltipItem) {
                          return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Time",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Angle",
                      },
                    },
                  },
                }}
              /> */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "20px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "rgba(75, 192, 192, 1)",
                  marginRight: "5px",
                }}
              ></div>
              <span>X Angle</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "20px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "rgba(153, 102, 255, 1)",
                  marginRight: "5px",
                }}
              ></div>
              <span>Y Angle</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "rgba(255, 159, 64, 1)",
                  marginRight: "5px",
                }}
              ></div>
              <span>Z Angle</span>
            </div>
          </div>
        </CCol>
      </CRow>

      {/* Date Picker Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <FormLabel>Select a date:</FormLabel>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="form-control"
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              handleDateSubmitModal(selectedPatientId, selectedDate)
            }
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Exercise Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <FormLabel>Select Date:</FormLabel>
              <DatePicker
                selected={selectedDate ? new Date(selectedDate) : new Date()}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
              />
            </FormGroup>
            <Button
              variant="primary"
              onClick={() =>
                handleDateSubmitModal(selectedPatientId, selectedDate)
              }
            >
              Submit
            </Button>
          </Form>
          {exerciseRawData.length > 0 && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={graphData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="x_angle" stroke="#8884d8" />
                <Line type="monotone" dataKey="y_angle" stroke="#82ca9d" />
                <Line type="monotone" dataKey="z_angle" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default Dashboard;
