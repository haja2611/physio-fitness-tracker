import React, { useEffect, useState } from "react";
import { useAuth } from "../../../services/AuthProvider";

import {
  CAvatar,
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

import {
  Modal,
  Button,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";
import { TablePagination } from "@mui/material";

const Clinic = () => {
  const [clinics, setClinics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [editModal, setEditModal] = useState({ show: false, clinic: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [newClinic, setNewClinic] = useState({
    name: "",
    description: "",
    address: "",
  });
  const [filter, setFilter] = useState({ name: "", patient_count: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { createClinic, updateClinic, deleteClinic, getClinicsForDoctor } =
    useAuth();

  useEffect(() => {
    // Fetch all clinics when the component mounts
    getClinicsForDoctor().then((data) => setClinics(data));
  }, [getClinicsForDoctor]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilter((prev) => ({ ...prev, [name]: value }));
  // };
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // .filter(
  //   (clinic) =>
  //     (filter.name === "" || clinic.name === filter.name) &&
  //     (filter.patient_count === "" ||
  //       clinic.patient_count === filter.patient_count)
  // );
  const indexOfLastClinic = currentPage * itemsPerPage;
  const indexOfFirstClinic = indexOfLastClinic - itemsPerPage;
  const currentClinic = filteredClinics.slice(
    indexOfFirstClinic,
    indexOfLastClinic
  );

  const handleCreateClinic = async (e) => {
    e.preventDefault();
    try {
      await createClinic(newClinic);
      // Update the clinics list
      const updatedClinics = await getClinicsForDoctor();
      setClinics(updatedClinics);
    } catch (error) {
      console.error("Error adding Clinic:", error);
    } finally {
      setShowModal(false);
      // Reset newClinic state
      setNewClinic({
        name: "",
        description: "",
        address: "",
      });
    }
  };

  const handleEditClininc = (clinic) => {
    setEditModal({ show: true, clinic });
    setNewClinic(clinic);
  };
  const handleUpdateClinic = async (e) => {
    e.preventDefault();
    const { id } = editModal.clinic;
    const updatedData = {
      ...editModal.clinic,
      ...newClinic,
    };
    const data = await updateClinic(id, updatedData);
    setClinics((prev) =>
      prev.map((clinic) => (clinic.id === id ? data : clinic))
    );
    setEditModal({ show: false, clinic: null });
    // Reset newClinic state
    setNewClinic({
      name: "",

      description: "",
      address: "",
    });
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleDeleteClinic = async () => {
    if (deleteConfirm.id) {
      await deleteClinic(deleteConfirm.id);
      setClinics((prev) =>
        prev.filter((clinic) => clinic.id !== deleteConfirm.id)
      );
    }
    setDeleteConfirm({ show: false, id: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClinic((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewClinic = (clinic) => {
    setSelectedClinic(clinic);
    setViewModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    // Reset newClinic state on modal close
    setNewClinic({
      name: "",

      description: "",
      address: "",
    });
  };
  const handleEditModalClose = () => {
    setEditModal({ show: false, clinic: null });
    // Reset newClinic state on modal close
    setNewClinic({
      name: "",

      description: "",
      address: "",
    });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns 'YYYY-MM-DD'
  };

  return (
    <div>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Clinics
              </h4>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton
                color="primary"
                className="float-end"
                onClick={() => setShowModal(true)}
              >
                Add Clinic
              </CButton>
              <Form.Control
                type="text"
                className="float-end"
                placeholder="Search Clinics"
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
            <CCardHeader>Clinic List</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>

                    <CTableHeaderCell>Address</CTableHeaderCell>
                    <CTableHeaderCell>Created At</CTableHeaderCell>
                    <CTableHeaderCell>Patient Count</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {filteredClinics.length > 0 ? (
                    currentClinic.map((clinic) => (
                      <CTableRow key={clinic.id}>
                        <CTableDataCell>{clinic.name}</CTableDataCell>
                        <CTableDataCell>{clinic.description}</CTableDataCell>
                        <CTableDataCell>{clinic.address}</CTableDataCell>
                        <CTableDataCell>
                          {formatDate(clinic.creation_date)}
                        </CTableDataCell>
                        <CTableDataCell>{clinic.patient_count}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="info"
                            onClick={() => handleViewClinic(clinic)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </CButton>
                          <CButton
                            color="warning"
                            onClick={() => handleEditClininc(clinic)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </CButton>
                          <CButton
                            color="danger"
                            onClick={() => handleDeleteConfirmation(clinic.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        No Clinic found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Create Clinic Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Clinic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateClinic}>
            <FormGroup className="mb-3">
              <FormLabel>Name</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter clinic name"
                name="name"
                value={newClinic.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Description</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter description"
                name="description"
                value={newClinic.description}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Address</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter address"
                name="address"
                value={newClinic.address}
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
      {/* View Clinic Modal */}
      <Modal show={viewModal} onHide={() => setViewModal(false)}>
        <Modal.Header closeButton onClick={handleModalClose}>
          <Modal.Title>Clinic Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClinic && (
            <>
              <h5>{selectedClinic.name}</h5>

              <p>
                <strong>Description:</strong> {selectedClinic.description}
              </p>
              <p>
                <strong>Address:</strong> {selectedClinic.address}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {formatDate(selectedClinic.creation_date)}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {formatDate(selectedClinic.updated_date)}
              </p>
              <p>
                <strong>Patient count:</strong> {selectedClinic.patient_count}
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Clinic Modal */}
      {editModal.clinic && (
        <Modal show={editModal.show} onHide={handleEditModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Clinic</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateClinic}>
              <FormGroup className="mb-3">
                <FormLabel>Name</FormLabel>
                <FormControl
                  type="text"
                  placeholder={editModal.clinic.name || "Enter clinic name"}
                  name="name"
                  value={newClinic.name || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Description</FormLabel>
                <FormControl
                  type="text"
                  placeholder={
                    editModal.clinic.description || "Enter description"
                  }
                  name="description"
                  value={newClinic.description || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Address</FormLabel>
                <FormControl
                  type="text"
                  placeholder={editModal.clinic.address || "Enter address"}
                  name="address"
                  value={newClinic.address || ""}
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
          <Modal.Title>Delete Clinic</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this clinic?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirm({ show: false, id: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteClinic}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          size="large"
          count={filteredClinics.length}
          rowsPerPage={itemsPerPage}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default Clinic;
