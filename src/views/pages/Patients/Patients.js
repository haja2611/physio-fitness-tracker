import React, { useState, useRef, useEffect } from "react";
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

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editModal, setEditModal] = useState({ show: false, patient: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [newPatient, setNewPatient] = useState({
    first_name: "",
    last_name: "",
    phonenumber: "",
    emailid: "",
    clinic_id: "",
    created_by: "",
    updated_by: "",
    profile: "",
    status: "",
  });

  const [filter, setFilter] = useState({ name: "", patient_count: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {
    createPatient,
    updatePatient,
    deletePatient,
    getPatientsByDoctor,
    // getExercises,
    getClinicsForDoctor,
  } = useAuth();

  useEffect(() => {
    // Fetch all Patients when the component mounts
    getPatientsByDoctor().then((data) => setPatients(data));
    getClinicsForDoctor().then((data) => setClinics(data));
  }, [getPatientsByDoctor, getClinicsForDoctor]);

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
    const clinic = clinics.find((clinic) => clinic.id === clinicId);
    return clinic ? clinic.name : "Unknown Clinic";
  };
  const filteredPatients = patients.filter(
    (patient) =>
      patient.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phonenumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastPatient = currentPage * itemsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage;
  const currentPatient = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const handleCreatepatient = async (e) => {
    e.preventDefault();
    try {
      await createPatient(newPatient);
      // Update the patients list
      const updatedPatient = await getPatientsByDoctor();
      setPatients(updatedPatient);
    } catch (error) {
      console.error("Error adding Patient:", error);
    } finally {
      setShowModal(false);
      // Reset newPatients state
      setNewPatient({
        first_name: "",
        last_name: "",
        phonenumber: "",
        emailid: "",
        clinic_id: "",
        created_by: "",
        updated_by: "",
        profile: "",
        status: "",
      });
    }
  };

  const handleEditPatient = (patient) => {
    setEditModal({ show: true, patient });
    setNewPatient(patient);
  };
  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    const { id } = editModal.patient;
    const updatedData = {
      ...editModal.patient,
      ...newPatient,
    };
    const data = await updatePatient(id, updatedData);
    setPatients((prev) =>
      prev.map((patient) => (patient.id === id ? data : patient))
    );
    setEditModal({ show: false, patient: null });
    // Reset newPatient state
    setNewPatient({
      first_name: "",
      last_name: "",
      phonenumber: "",
      emailid: "",
      clinic_id: "",
      created_by: "",
      updated_by: "",
      profile: "",
      status: "",
    });
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirm({ show: true, id });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };
  const handleDeletePatient = async () => {
    if (deleteConfirm.id) {
      await deletePatient(deleteConfirm.id);
      setPatients((prev) =>
        prev.filter((Patient) => Patient.id !== deleteConfirm.id)
      );
    }
    setDeleteConfirm({ show: false, id: null });
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setViewModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    // Reset newPatient  state on modal close
    setNewPatient({
      first_name: "",
      last_name: "",
      phonenumber: "",
      emailid: "",
      created_by: "",
      updated_by: "",
      profile: "",
      status: "",
    });
  };
  const handleEditModalClose = () => {
    setEditModal({ show: false, patient: null });
    // Reset newPatients state on modal close
    setNewPatient({
      first_name: "",
      last_name: "",
      phonenumber: "",
      emailid: "",
      created_by: "",
      updated_by: "",
      profile: "",
      status: "",
    });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns 'YYYY-MM-DD'
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
                Patients
              </h4>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton
                color="primary"
                className="float-end"
                onClick={() => setShowModal(true)}
              >
                Add Patient
              </CButton>
              <Form.Control
                type="text"
                className="float-end"
                placeholder="Search Patients"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ width: "300px", marginRight: "10px" }}
              />
              {/* <Form.Control
                as="select"
                name=""
                className="float-end"
                value={filter.bodyPart}
                onChange={handleFilterChange}
                style={{
                  width: "150px",
                  display: "inline-block",
                  marginRight: "10px",
                }}
              >
                <option value="">All Body Parts</option>
                <option value="arms">Arms</option>
                <option value="legs">Legs</option>
                <option value="back">Back</option> */}
              {/* Add more options as needed */}
              {/* </Form.Control> */}

              {/* <Form.Control
                as="select"
                name="equipment"
                value={filter.equipment}
                onChange={handleFilterChange}
                style={{
                  width: "150px",
                  display: "inline-block",
                  marginLeft: "10px",
                }}
              >
                <option value="">All Equipment</option>
                <option value="dumbbell">Dumbbell</option>
                <option value="barbell">Barbell</option>
                <option value="bodyweight">Bodyweight</option>
                
              </Form.Control> */}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Patient List</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell>Profile</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Phone Number</CTableHeaderCell>

                    <CTableHeaderCell>Email</CTableHeaderCell>

                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {filteredPatients.length > 0 ? (
                    currentPatient.map((patient) => (
                      <CTableRow key={patient.id}>
                        <CTableDataCell>{patient.profile}</CTableDataCell>
                        <CTableDataCell>
                          {renderPatientName(patient)}
                        </CTableDataCell>
                        <CTableDataCell>{patient.phonenumber}</CTableDataCell>
                        <CTableDataCell>{patient.emailid}</CTableDataCell>
                        <CTableDataCell>{patient.status}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="info"
                            onClick={() => handleViewPatient(patient)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </CButton>
                          <CButton
                            color="warning"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </CButton>
                          <CButton
                            color="danger"
                            onClick={() => handleDeleteConfirmation(patient.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        No Patient found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Create Patient Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreatepatient}>
            <FormGroup className="mb-3">
              <FormLabel>First Name</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter patient's First Name"
                name="first_name"
                value={newPatient.first_name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Last Name</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter patient's Last Name"
                name="last_name"
                value={newPatient.last_name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Phone Number</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter Phone number"
                name="phonenumber"
                value={newPatient.phonenumber}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Email</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter Email"
                name="emailid"
                value={newPatient.emailid}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Select Clinic</FormLabel>
              <FormControl
                as="select"
                name="clinic_id"
                value={newPatient.clinic_id}
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
              <FormLabel>Status</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter Status"
                name="status"
                value={newPatient.status}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <FormLabel>Created By</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter Created By"
                name="created_by"
                value={newPatient.created_by}
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
      {/* View patient Modal */}
      <Modal show={viewModal} onHide={() => setViewModal(false)}>
        <Modal.Header closeButton onClick={handleModalClose}>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <>
              <h5>
                {selectedPatient.first_name} {""} {selectedPatient.last_name}
              </h5>

              <p>
                <strong>Phone Number:</strong> {""}{" "}
                {selectedPatient.phonenumber}
              </p>
              <p>
                <strong>Email:</strong> {""} {selectedPatient.emailid}
              </p>
              <p>
                <strong>Clinic:</strong> {""}
                {getClinicName(selectedPatient.clinic_id)}
              </p>
              <p>
                <strong>Created At:</strong> {""}
                {formatDate(selectedPatient.creation_date)}
              </p>
              <p>
                <strong>Updated At:</strong> {""}
                {formatDate(selectedPatient.updated_date)}
              </p>
              <p>
                <strong>Created by:</strong> {""}
                {selectedPatient.created_by}
              </p>
              <p>
                <strong>Updated by:</strong> {""}
                {selectedPatient.updated_by}
              </p>
              <p>
                <strong>Status:</strong> {""}
                {selectedPatient.status}
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Patient Modal */}
      {editModal.patient && (
        <Modal show={editModal.show} onHide={handleEditModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Patient</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdatePatient}>
              <FormGroup className="mb-3">
                <FormLabel>First Name</FormLabel>
                <FormControl
                  type="text"
                  placeholder={
                    editModal.patient.first_name || "Enter First Name"
                  }
                  name="first_name"
                  value={newPatient.first_name || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Last Name</FormLabel>
                <FormControl
                  type="text"
                  placeholder={editModal.patient.last_name || "Enter Last Name"}
                  name="last_name"
                  value={newPatient.last_name || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Phone Number</FormLabel>
                <FormControl
                  type="text"
                  placeholder={
                    editModal.patient.phonenumber || "Enter Phone Number"
                  }
                  name="phonenumber"
                  value={newPatient.phonenumber || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Email</FormLabel>
                <FormControl
                  type="text"
                  placeholder={editModal.patient.emailid || "Enter Email"}
                  name="emailid"
                  value={newPatient.emailid || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Select Clinic</FormLabel>
                <FormControl
                  as="select"
                  name="clinic_id"
                  value={newPatient.clinic_id}
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
                <FormLabel>Update by</FormLabel>
                <FormControl
                  type="text"
                  placeholder={
                    editModal.patient.updated_by || "Enter updated by"
                  }
                  name="updated_by"
                  value={newPatient.updated_by || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Status</FormLabel>
                <FormControl
                  type="text"
                  placeholder={editModal.patient.status || "Enter Status"}
                  name="status"
                  value={newPatient.status || ""}
                  onChange={handleInputChange}
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
          <Modal.Title>Delete Patient</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Patient?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirm({ show: false, id: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePatient}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          size="large"
          count={filteredPatients.length}
          rowsPerPage={itemsPerPage}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default Patients;
