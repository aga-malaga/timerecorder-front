import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { basicAuth } from "../common/basicAuth";

export const UpdateProject = (props) => {
  const [name, setName] = useState(props.project.name);
  const [description, setDescription] = useState(props.project.description);
  const [start, setStart] = useState(props.project.start);
  const [stop, setStop] = useState(props.project.stop);
  const [budget, setBudget] = useState(props.project.budget);

  const Auth = useAuth();
  const user = Auth.getUser();

  const updateProject = (event, uuid) => {
    event.preventDefault();
    event.stopPropagation();

    const project = {
      projectUuid: props.project.uuid,
      name: name,
      description: description,
      start: start,
      stop: stop,
      budget: budget,
    };

    const url = "http://localhost:8080/api/projects";
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth(user),
      },
      body: JSON.stringify(project),
    })
      .then((response) => {
        if (response.status === 403 || response.status === 400) {
          alert("Nie można wykonać akcji, popraw formularz");
        }
      })
      .then(() => {
        props.onHide();
      })
      .catch((error) => {
        console.error("Error updating project:", error);
      });
  };

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Edytuj projekt</Modal.Title>
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
                  name="start"
                  value={start}
                  onChange={(event) => setStart(event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Data końca:</Form.Label>
                <Form.Control
                  type="date"
                  name="stop"
                  value={stop}
                  onChange={(event) => setStop(event.target.value)}
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
          <Button variant="secondary" onClick={props.onHide}>
            Anuluj
          </Button>
          <Button variant="primary" onClick={updateProject}>
            Edytuj projekt
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
