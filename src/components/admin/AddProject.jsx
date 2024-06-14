import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { basicAuth } from "../common/basicAuth";

export const AddProject = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(0);

  const Auth = useAuth();
  const user = Auth.getUser();

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const isValidDate = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dateString);
  };

  const addNewProject = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!name || !description || !startDate || !endDate || !budget) {
      alert("Wszystkie pola wymagane");
      return;
    }

    if (isNaN(budget) || budget <= 0) {
      alert("Budżet musi być dodatni");
      return;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      alert("Invalid date format");
      return;
    }

    const newProject = {
      name: name,
      description: description,
      startDate: startDate,
      endDate: endDate,
      budget: budget,
    };

    const url = "http://localhost:8080/api/projects";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth(user),
      },
      body: JSON.stringify(newProject),
    })
      .then((response) => {
        if (response.status === 403 || response.status === 400 || response.status === 404) {
          alert("Nie można wykonać akcji, popraw formularz");
        }
      })
      .then((data) => console.log(data));

    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Dodaj projekt
      </Button>

      <Modal
        show={showModal}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Dodaj projekt
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div>
              <Form.Group className="mb-3">
                <Form.Label>Nazwa:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Opis:</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Data startu:</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Data końca:</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Budżet:</Form.Label>
                <Form.Control
                  type="number"
                  name="budget"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Zamknij
          </Button>
          <Button variant="primary" onClick={(event) => addNewProject(event)}>
            Utwórz projekt
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
