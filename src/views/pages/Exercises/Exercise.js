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

const Exercise = () => {
  const [exercises, setExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [editModal, setEditModal] = useState({ show: false, exercise: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [newExercise, setNewExercise] = useState({
    name: "",
    bodyPart: "",
    equipment: "",
    target: "",
    secondaryMuscles: [],
    instructions: [],
    gifUrl: "",
    created_by: "",
    updated_by: "",
  });
  const [filter, setFilter] = useState({ bodyPart: "", equipment: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const {
    createExercise,
    getExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
  } = useAuth();

  useEffect(() => {
    // Fetch all exercises when the component mounts
    getExercises().then((data) => setExercises(data));
  }, [getExercises]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const filteredExercises = exercises
    .filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.target.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (exercise) =>
        (filter.bodyPart === "" || exercise.bodyPart === filter.bodyPart) &&
        (filter.equipment === "" || exercise.equipment === filter.equipment)
    );
  const indexOfLastExercise = currentPage * itemsPerPage;
  const indexOfFirstExercise = indexOfLastExercise - itemsPerPage;
  const currentExercises = filteredExercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    try {
      const data = await createExercise(newExercise);
      // Re-fetch the exercises to update the list
      const updatedExercises = await getExercises();
      setExercises(updatedExercises);
    } catch (error) {
      console.error("Error adding exercise:", error);
    } finally {
      setShowModal(false);
      // Reset newExercise state
      setNewExercise({
        name: "",
        bodyPart: "",
        equipment: "",
        target: "",
        secondaryMuscles: [],
        instructions: [],
        gifUrl: "",
        created_by: "",
        updated_by: "",
      });
    }
  };

  const handleEditExercise = (exercise) => {
    setEditModal({ show: true, exercise });
    setNewExercise(exercise);
  };
  const handleUpdateExercise = async (e) => {
    e.preventDefault();
    const { id } = editModal.exercise;
    const updatedData = {
      ...editModal.exercise,
      ...newExercise,
      secondaryMuscles: newExercise.secondaryMuscles || [], // Ensure array
      instructions: newExercise.instructions || [], // Ensure array
    };
    const data = await updateExercise(id, updatedData);
    setExercises((prev) =>
      prev.map((exercise) => (exercise.id === id ? data : exercise))
    );
    setEditModal({ show: false, exercise: null });
    // Reset newExercise state
    setNewExercise({
      name: "",
      bodyPart: "",
      equipment: "",
      target: "",
      secondaryMuscles: [],
      instructions: [],
      gifUrl: "",
      created_by: "",
      updated_by: "",
    });
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleDeleteExercise = async () => {
    if (deleteConfirm.id) {
      await deleteExercise(deleteConfirm.id);
      setExercises((prev) =>
        prev.filter((exercise) => exercise.id !== deleteConfirm.id)
      );
    }
    setDeleteConfirm({ show: false, id: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise((prev) => ({ ...prev, [name]: value }));
  };
  const handleSecondaryMusclesChange = (e) => {
    const { value } = e.target;
    setNewExercise((prev) => ({
      ...prev,
      secondaryMuscles: value.split(",").map((muscle) => muscle.trim()),
    }));
  };
  const handleInstructionsChange = (e) => {
    const { value } = e.target;
    setNewExercise((prev) => ({
      ...prev,
      instructions: value.split("\n").map((instruction) => instruction.trim()),
    }));
  };
  const handleViewExercise = (exercise) => {
    setSelectedExercise(exercise);
    setViewModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    // Reset newExercise state on modal close
    setNewExercise({
      name: "",
      bodyPart: "",
      equipment: "",
      target: "",
      secondaryMuscles: [],
      instructions: [],
      gifUrl: "",
      created_by: "",
      updated_by: "",
    });
  };
  const handleEditModalClose = () => {
    setEditModal({ show: false, exercise: null });
    // Reset newExercise state on modal close
    setNewExercise({
      name: "",
      bodyPart: "",
      equipment: "",
      target: "",
      secondaryMuscles: [],
      instructions: [],
      gifUrl: "",
      created_by: "",
      updated_by: "",
    });
  };
  return (
    <div>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Exercises
              </h4>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton
                color="primary"
                className="float-end"
                onClick={() => setShowModal(true)}
              >
                Add Exercise
              </CButton>
              <Form.Control
                type="text"
                className="float-end"
                placeholder="Search exercises"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ width: "300px", marginRight: "10px" }}
              />
              <Form.Control
                as="select"
                name="bodyPart"
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
                <option value="back">Back</option>
                {/* Add more options as needed */}
              </Form.Control>
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
            <CCardHeader>Exercise List</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Body Part</CTableHeaderCell>

                    <CTableHeaderCell>Equipment</CTableHeaderCell>
                    <CTableHeaderCell>Target</CTableHeaderCell>
                    {/* <CTableHeaderCell>Gif</CTableHeaderCell> */}
                    <CTableHeaderCell>Secondary Muscles</CTableHeaderCell>

                    {/* <CTableHeaderCell>Instructions</CTableHeaderCell> */}
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {filteredExercises.length > 0 ? (
                    currentExercises.map((exercise) => (
                      <CTableRow key={exercise.id}>
                        <CTableDataCell>{exercise.name}</CTableDataCell>
                        <CTableDataCell>{exercise.bodyPart}</CTableDataCell>
                        <CTableDataCell>{exercise.equipment}</CTableDataCell>
                        <CTableDataCell>{exercise.target}</CTableDataCell>
                        <CTableDataCell>
                          {exercise.secondaryMuscles &&
                          Array.isArray(exercise.secondaryMuscles)
                            ? exercise.secondaryMuscles.join(", ")
                            : exercise.secondaryMuscles}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="info"
                            onClick={() => handleViewExercise(exercise)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </CButton>
                          <CButton
                            color="warning"
                            onClick={() => handleEditExercise(exercise)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </CButton>
                          <CButton
                            color="danger"
                            onClick={() =>
                              handleDeleteConfirmation(exercise.id)
                            }
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        No exercises found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Create Exercise Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateExercise}>
            <FormGroup className="mb-3">
              <FormLabel>Name</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter exercise name"
                name="name"
                value={newExercise.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Body Part</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter body part"
                name="bodyPart"
                value={newExercise.bodyPart}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Equipment</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter equipment"
                name="equipment"
                value={newExercise.equipment}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Target</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter target"
                name="target"
                value={newExercise.target}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Secondary Muscles</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter secondary muscles"
                name="secondaryMuscles"
                value={newExercise.secondaryMuscles}
                onChange={handleSecondaryMusclesChange}
              />
            </FormGroup>{" "}
            <FormGroup className="mb-3">
              <FormLabel>Instructions</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter exercise instructions"
                name="instructions"
                value={newExercise.instructions}
                onChange={handleInstructionsChange}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Created by</FormLabel>
              <FormControl
                type="text"
                placeholder="Created by"
                name="created_by"
                value={newExercise.created_by}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>Updated_by</FormLabel>
              <FormControl
                type="text"
                placeholder="updated_by"
                name="updated_by"
                value={newExercise.updated_by}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormLabel>GIF URL</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter GIF URL"
                name="gifUrl"
                value={newExercise.gifUrl}
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
      {/* View Exercise Modal */}
      <Modal show={viewModal} onHide={() => setViewModal(false)}>
        <Modal.Header closeButton onClick={handleModalClose}>
          <Modal.Title>Exercise Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExercise && (
            <>
              <h5>{selectedExercise.name}</h5>

              <p>
                <strong>Body Part:</strong> {selectedExercise.bodyPart}
              </p>
              <p>
                <strong>Equipment:</strong> {selectedExercise.equipment}
              </p>
              <p>
                <strong>Target:</strong> {selectedExercise.target}
              </p>
              <p>
                <strong>Secondary Muscles:</strong>{" "}
                {selectedExercise.secondaryMuscles &&
                Array.isArray(selectedExercise.secondaryMuscles)
                  ? selectedExercise.secondaryMuscles.join(", ")
                  : selectedExercise.secondaryMuscles}
              </p>
              <p>
                <strong>Instructions:</strong> {selectedExercise.instructions}
              </p>
              <p>
                <strong>created_by:</strong> {selectedExercise.created_by}
              </p>
              <p>
                <strong>updated_by:</strong> {selectedExercise.updated_by}
              </p>
              <p>
                <strong>GIF:</strong>
                <br />
                <img
                  src={selectedExercise.gifUrl}
                  alt={selectedExercise.name}
                  style={{ width: "100%" }}
                />
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Exercise Modal */}
      {editModal.exercise && (
        <Modal show={editModal.show} onHide={handleEditModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Exercise</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateExercise}>
              <FormGroup className="mb-3">
                <FormLabel>Name</FormLabel>
                <FormControl
                  type="text"
                  placeholder={editModal.exercise.name || "Enter exercise name"}
                  name="name"
                  value={newExercise.name || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Body Part</FormLabel>
                <FormControl
                  type="text"
                  placeholder={editModal.exercise.bodyPart || "Enter body part"}
                  name="bodyPart"
                  value={newExercise.bodyPart || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Equipment</FormLabel>
                <FormControl
                  type="text"
                  placeholder={
                    editModal.exercise.equipment || "Enter equipment"
                  }
                  name="equipment"
                  value={newExercise.equipment || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Target</FormLabel>
                <FormControl
                  type="text"
                  placeholder={editModal.exercise.target || "Enter target"}
                  name="target"
                  value={newExercise.target || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Secondary Muscles</FormLabel>
                <FormControl
                  type="text"
                  placeholder={
                    editModal.exercise.secondaryMuscles ||
                    "Enter secondary muscles"
                  }
                  name="secondaryMuscles"
                  value={newExercise.secondaryMuscles || ""}
                  onChange={handleSecondaryMusclesChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Instructions</FormLabel>
                <FormControl
                  type="text"
                  placeholder={
                    editModal.exercise.instructions || "Enter instructions"
                  }
                  name="instructions"
                  value={newExercise.instructions || ""}
                  onChange={handleInstructionsChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Created by</FormLabel>
                <FormControl
                  type="text"
                  placeholder={editModal.exercise.created_by || "Created by"}
                  name="created_by"
                  value={newExercise.created_by || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>Updated by</FormLabel>
                <FormControl
                  type="text"
                  placeholder={editModal.exercise.updated_by || "Updated by"}
                  name="updated_by"
                  value={newExercise.updated_by || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel>GIF URL</FormLabel>
                <FormControl
                  type="text"
                  placeholder={editModal.exercise.gifUrl || "Enter GIF URL"}
                  name="gifUrl"
                  value={newExercise.gifUrl || ""}
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
          <Modal.Title>Delete Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this exercise?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirm({ show: false, id: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteExercise}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          size="large"
          count={filteredExercises.length}
          rowsPerPage={itemsPerPage}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default Exercise;
