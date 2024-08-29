import React, { useState, useEffect } from "react";
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

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [editModal, setEditModal] = useState({ show: false, device: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [newDevice, setNewDevice] = useState({
    device_type: "",
    capabilities: "",
    current_load: "",
    authorized: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {
    createDevice,
    updateDevice,
    deleteDevice,
    getDevicesByDoctor,
    // getExercises,
  } = useAuth();

  useEffect(() => {
    getDevicesByDoctor().then((data) => setDevices(data));
  }, [getDevicesByDoctor]);

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

  const filteredDevices = devices.filter(
    (device) =>
      device.device_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.capabilities.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.current_load.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.authorized.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastDevice = currentPage * itemsPerPage;
  const indexOfFirstDevice = indexOfLastDevice - itemsPerPage;
  const currentDevice = filteredDevices.slice(
    indexOfFirstDevice,
    indexOfLastDevice
  );
  const handleCreatedevice = async (e) => {
    e.preventDefault();
    try {
      await createDevice(newDevice);
      // Update the Devices list
      const updatedDevice = await getDevicesByDoctor();
      setDevices(updatedDevice);
    } catch (error) {
      console.error("Error adding Device:", error);
    } finally {
      setShowModal(false);
      // Reset newDevices state
      setNewDevice({
        device_type: "",
        capabilities: "",
        current_load: "",
        authorized: "",
      });
    }
  };

  const handleEditDevice = (device) => {
    setEditModal({ show: true, device });
    setNewDevice(device);
  };
  const handleUpdateDevice = async (e) => {
    e.preventDefault();
    const { id } = editModal.device;
    const updatedData = {
      ...editModal.device,
      ...newDevice,
    };
    const data = await updateDevice(id, updatedData);
    setDevices((prev) =>
      prev.map((device) => (device.id === id ? data : device))
    );
    setEditModal({ show: false, device: null });
    // Reset newDevice state
    setNewDevice({
      device_type: "",
      capabilities: "",
      current_load: "",
      authorized: "",
    });
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirm({ show: true, id });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDevice((prev) => ({ ...prev, [name]: value }));
  };
  const handleDeleteDevice = async () => {
    if (deleteConfirm.id) {
      await deleteDevice(deleteConfirm.id);
      setDevices((prev) =>
        prev.filter((Device) => Device.id !== deleteConfirm.id)
      );
    }
    setDeleteConfirm({ show: false, id: null });
  };

  const handleViewDevice = (device) => {
    setSelectedDevice(device);
    setViewModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    // Reset newDevice  state on modal close
    setNewDevice({
      device_type: "",
      capabilities: "",
      current_load: "",
      authorized: "",
    });
  };
  const handleEditModalClose = () => {
    setEditModal({ show: false, device: null });
    // Reset newDevices state on modal close
    setNewDevice({
      device_type: "",
      capabilities: "",
      current_load: "",
      authorized: "",
    });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns 'YYYY-MM-DD'
  };
  // const renderDeviceName = (device) => {
  //   return `${patient.first_name} ${patient.last_name}`;
  // };

  return (
    <div>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Devices
              </h4>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton
                color="primary"
                className="float-end"
                onClick={() => setShowModal(true)}
              >
                Add Device
              </CButton>
              <Form.Control
                type="text"
                className="float-end"
                placeholder="Search Device"
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
            <CCardHeader>Device List</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell>Device Type</CTableHeaderCell>
                    <CTableHeaderCell>Capabilities</CTableHeaderCell>
                    <CTableHeaderCell>Current Load</CTableHeaderCell>

                    <CTableHeaderCell>Authorized</CTableHeaderCell>

                    {/* <CTableHeaderCell>Status</CTableHeaderCell> */}
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {filteredDevices.length > 0 ? (
                    currentDevice.map((device) => (
                      <CTableRow key={device.id}>
                        <CTableDataCell>{device.device_type}</CTableDataCell>

                        <CTableDataCell>{device.capabilities}</CTableDataCell>
                        <CTableDataCell>{device.current_load}</CTableDataCell>
                        <CTableDataCell>{device.authorized}</CTableDataCell>

                        <CTableDataCell>
                          <CButton
                            color="info"
                            onClick={() => handleViewDevice(device)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </CButton>
                          <CButton
                            color="warning"
                            onClick={() => handleEditDevice(device)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </CButton>
                          <CButton
                            color="danger"
                            onClick={() => handleDeleteConfirmation(device.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        No Device found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Create Device Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Device</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreatedevice}>
            <FormGroup className="mb-3">
              <FormLabel>Device Type</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter Device's Type"
                name="device_type"
                value={newDevice.device_type}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Capabilities</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter Device's capabilities"
                name="capabilities"
                value={newDevice.capabilities}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Current Load</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter Current Load"
                name="current_load"
                value={newDevice.current_load}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Authorized</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter Authorized"
                name="authorized"
                value={newDevice.authorized}
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
      {/* View Device Modal */}
      <Modal show={viewModal} onHide={() => setViewModal(false)}>
        <Modal.Header closeButton onClick={handleModalClose}>
          <Modal.Title>Device Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDevice && (
            <>
              <p>
                <strong>Device Type:</strong> {""} {selectedDevice.device_type}
              </p>
              <p>
                <strong>Capabilities:</strong> {""}{" "}
                {selectedDevice.capabilities}
              </p>
              <p>
                <strong>Current Load:</strong> {""}
                {selectedDevice.current_load}
              </p>
              <p>
                <strong>Authorized:</strong> {""}
                {selectedDevice.authorized}
              </p>
              <p>
                <strong>Created At:</strong> {""}
                {formatDate(selectedDevice.creation_date)}
              </p>

              <p>
                <strong>Updated At:</strong> {""}
                {formatDate(selectedDevice.updated_date)}
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Device Modal */}
      {editModal.device && (
        <Modal show={editModal.show} onHide={handleEditModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Device</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateDevice}>
              <FormGroup className="mb-3">
                <FormLabel>Device Type</FormLabel>
                <FormControl
                  type="text"
                  placeholder={
                    editModal.device.device_type || "Enter Device Type"
                  }
                  name="device_type"
                  value={newDevice.device_type || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Capabilities</FormLabel>
                <FormControl
                  type="text"
                  placeholder={
                    editModal.device.capabilities || "Enter capablities"
                  }
                  name="capabilities"
                  value={newDevice.capabilities || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Current Load</FormLabel>
                <FormControl
                  type="text"
                  placeholder={
                    editModal.device.current_load || "Enter Current Load"
                  }
                  name="current_load"
                  value={newDevice.current_load || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Authorized</FormLabel>
                <FormControl
                  type="text"
                  placeholder={
                    editModal.device.authorized || "Enter Authorized"
                  }
                  name="authorized"
                  value={newDevice.authorized || ""}
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
          <Modal.Title>Delete Device</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Device?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirm({ show: false, id: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteDevice}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          size="large"
          count={filteredDevices.length}
          rowsPerPage={itemsPerPage}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default Devices;
