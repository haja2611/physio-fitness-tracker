import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../services/AuthProvider";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// Importing react-bootstrap components
import {
  Modal,
  Button,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";
import { TablePagination } from "@mui/material";

const Session = () => {
  const [session, setSession] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [patients, setPatients] = useState([]);
  const [device, setDevicves] = useState([]);
  const [exercise, setExercise] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [editModal, setEditModal] = useState({ show: false, session: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [newSession, setNewSession] = useState({
    patient_id: "",
    clinic_id: "",
    exercise_id: "",
    device_id: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {
    createSession,
    updateSession,
    deleteSession,
    getSessionByDoctor,
    getExercises,
    getClinicsForDoctor,
    getDevicesByDoctor,
    getPatientsByClinic,
    getPatientsByDoctor,
  } = useAuth();

  useEffect(() => {
    // Fetch all data when the component mounts
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };
  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };
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

  const indexOfLastSession = currentPage * itemsPerPage;
  const indexOfFirstSession = indexOfLastSession - itemsPerPage;
  const currentSession = filteredSession.slice(
    indexOfFirstSession,
    indexOfLastSession
  );
  const handleCreatesession = async (e) => {
    e.preventDefault();
    try {
      await createSession(newSession);
      // Update the session list
      const updatedSession = await getSessionByDoctor();
      setSession(updatedSession);
    } catch (error) {
      console.error("Error adding Session:", error);
    } finally {
      setShowModal(false);
      // Reset newSession state
      setNewSession({
        patient_id: "",
        clinic_id: "",
        exercise_id: "",
        device_id: "",
        start_date: "",
        end_date: "",
        description: "",
      });
    }
  };

  const handleEditSession = (session) => {
    setEditModal({ show: true, session });
    setNewSession(session);
  };
  const handleUpdateSession = async (e) => {
    e.preventDefault();
    const { id } = editModal.session;
    const updatedData = {
      ...editModal.session,
      ...newSession,
    };
    try {
      await updateSession(id, updatedData);
      const updatedSession = await getSessionByDoctor();
      setSession(updatedSession);
    } catch (error) {
      console.error("Error updating Session:", error);
    } finally {
      setEditModal({ show: false, session: null });
      setNewSession({
        patient_id: "",
        clinic_id: "",
        exercise_id: "",
        device_id: "",
        start_date: "",
        end_date: "",
        description: "",
      });
    }
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirm({ show: true, id });
  };
  const filterPatientsByClinic = (clinicId) => {
    const filteredPatients = patients.filter(
      (patient) => patient.clinic_id === clinicId
    );
    setFilteredPatients(filteredPatients); // Update the state with filtered patients
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewSession((prev) => ({ ...prev, [name]: value }));

    if (name === "clinic_id") {
      setSelectedClinicId(value);
      filterPatientsByClinic(value); // Filter patients based on selected clinic
    }
  };

  const handleDeleteSession = async () => {
    if (deleteConfirm.id) {
      await deleteSession(deleteConfirm.id);
      setSession((prev) =>
        prev.filter((Session) => Session.id !== deleteConfirm.id)
      );
    }
    setDeleteConfirm({ show: false, id: null });
  };

  const handleViewSession = (session) => {
    setSelectedSession(session);
    setViewModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    // Reset newSession  state on modal close
    setNewSession({
      patient_id: "",
      clinic_id: "",
      exercise_id: "",
      device_id: "",
      start_date: "",
      end_date: "",
      description: "",
    });
  };
  const handleEditModalClose = () => {
    setEditModal({ show: false, session: null });
    // Reset newSession state on modal close
    setNewSession({
      patient_id: "",
      clinic_id: "",
      exercise_id: "",
      device_id: "",
      start_date: "",
      end_date: "",
      description: "",
    });
  };
  console.log("Session:", session);

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
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Return date in yyyy-MM-dd format
  };

  const renderPatientName = (patient) => {
    return `${patient.first_name} ${patient.last_name}`;
  };

  return (
    <div>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Session
              </h4>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton
                color="primary"
                className="float-end"
                onClick={() => setShowModal(true)}
              >
                Add Session
              </CButton>
              <Form.Control
                type="text"
                className="float-end"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ width: "300px", marginRight: "10px" }}
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Session List</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell>Patient Name</CTableHeaderCell>
                    <CTableHeaderCell>Clinic</CTableHeaderCell>
                    <CTableHeaderCell>Exercise</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Device</CTableHeaderCell>
                    <CTableHeaderCell>Start Date</CTableHeaderCell>
                    <CTableHeaderCell>End Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {filteredSession.length > 0 ? (
                    currentSession.map((session, index) => (
                      <CTableRow key={session.id || index}>
                        <CTableDataCell>
                          {getPatientName(session.patient_id)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {" "}
                          {getClinicName(session.clinic_id)}
                        </CTableDataCell>
                        <CTableDataCell>
                          {" "}
                          {getExerciseName(session.exercise_id)}
                        </CTableDataCell>
                        <CTableDataCell>{session.description}</CTableDataCell>
                        <CTableDataCell>
                          {" "}
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
                            onClick={() => handleViewSession(session)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </CButton>
                          <CButton
                            color="warning"
                            onClick={() => handleEditSession(session)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </CButton>
                          <CButton
                            color="danger"
                            onClick={() => handleDeleteConfirmation(session.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        No Session found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Create Session Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreatesession}>
            <FormGroup className="mb-3">
              <FormLabel>Select Clinic</FormLabel>
              <FormControl
                as="select"
                name="clinic_id"
                value={newSession.clinic_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Clinic</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Select Patient</FormLabel>
              <FormControl
                as="select"
                name="patient_id"
                value={newSession.patient_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Patient</option>
                {filteredPatients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Select Exercise</FormLabel>
              <FormControl
                as="select"
                name="exercise_id"
                value={newSession.exercise_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Exercise</option>
                {exercise.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </FormControl>
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Select Device</FormLabel>
              <FormControl
                as="select"
                name="device_id"
                value={newSession.device_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Device</option>
                {device.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.device_type}
                  </option>
                ))}
              </FormControl>
            </FormGroup>

            <FormGroup className="mb-3">
              <FormLabel>Start Date</FormLabel>
              <FormControl
                type="date"
                placeholder="Enter Start Date"
                name="start_date"
                value={newSession.start_date}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <FormLabel>End Date</FormLabel>
              <FormControl
                type="date"
                placeholder="Enter End Date"
                name="end_date"
                value={newSession.end_date}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Description</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter Description"
                name="description"
                value={newSession.description}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* View session Modal */}
      <Modal show={viewModal} onHide={() => setViewModal(false)}>
        <Modal.Header closeButton onClick={handleModalClose}>
          <Modal.Title>Session Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSession && (
            <>
              <h5>{getPatientName(selectedSession.patient_id)}</h5>

              <p>
                <strong>Clinic:</strong> {""}{" "}
                {getClinicName(selectedSession.clinic_id)}
              </p>
              <p>
                <strong>Exercise:</strong> {""}{" "}
                {getExerciseName(selectedSession.exercise_id)}
              </p>
              <p>
                <strong>Device:</strong> {""}
                {getDeviceName(selectedSession.device_id)}
              </p>
              <p>
                <strong>Description:</strong> {""}
                {selectedSession.description}
              </p>
              <p>
                <strong>Start Date:</strong> {""}
                {formatDate(selectedSession.start_date)}
              </p>
              <p>
                <strong>End Date:</strong> {""}
                {formatDate(selectedSession.end_date)}
              </p>
              <p>
                <strong>Created At:</strong> {""}
                {formatDate(selectedSession.creation_date)}
              </p>
              <p>
                <strong>Updated At:</strong> {""}
                {formatDate(selectedSession.updated_date)}
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Session Modal */}
      {editModal.session && (
        <Modal show={editModal.show} onHide={handleEditModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Session</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateSession}>
              <FormGroup className="mb-3">
                <FormLabel>Select Clinic</FormLabel>
                <FormControl
                  as="select"
                  name="clinic_id"
                  value={newSession.clinic_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Clinic</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </FormControl>{" "}
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Select Patient</FormLabel>
                <FormControl
                  as="select"
                  name="patient_id"
                  value={newSession.patient_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Patient</option>
                  {filteredPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </FormControl>{" "}
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Select Exercise</FormLabel>
                <FormControl
                  as="select"
                  name="exercise_id"
                  value={newSession.exercise_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Exercise</option>
                  {exercise.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Select Device</FormLabel>
                <FormControl
                  as="select"
                  name="device_id"
                  value={newSession.device_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Device</option>
                  {device.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.device_type}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>

              <FormGroup className="mb-3">
                <FormLabel>Start Date</FormLabel>
                <FormControl
                  type="date"
                  placeholder="Enter Start Date"
                  name="start_date"
                  value={newSession.start_date}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <FormLabel>End Date</FormLabel>
                <FormControl
                  type="date"
                  placeholder="Enter End Date"
                  name="end_date"
                  value={newSession.end_date}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Description</FormLabel>
                <FormControl
                  type="text"
                  placeholder="Enter Description"
                  name="description"
                  value={newSession.description}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={deleteConfirm.show}
        onHide={() => setDeleteConfirm({ show: false, id: null })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Session?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirm({ show: false, id: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSession}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          size="large"
          count={filteredSession.length}
          rowsPerPage={itemsPerPage}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default Session;
