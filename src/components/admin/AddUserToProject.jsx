import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Dropdown } from "react-bootstrap";
import "./AddUser.css";
import { useAuth } from "../context/AuthContext";
import { basicAuth } from "../common/basicAuth";

export const AddUserToProject = ({ show, onHide, onUpdate, user }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [enterOn, setEnterOn] = useState("");
  const [leaveOn, setLeaveOn] = useState("");

  const Auth = useAuth();
  const loggedUser = Auth.getUser();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    const url = "http://localhost:8080/api/projects";
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: basicAuth(loggedUser),
      },
    })
      .then((data) => data.json())
      .then((response) => setProjects(response.content))
      .catch((error) => console.error("Error fetching projects:", error));
  };

  const addUserToProject = (event) => {
    event.preventDefault();

    if (!selectedProject) {
      console.error("Proszę wybrać projekt");
      return;
    }

    const newUserToProject = {
      projectUuid: selectedProject.uuid,
      userUuid: user.uuid,
      enterOn: enterOn,
      leaveOn: leaveOn,
    };

    const url = "http://localhost:8080/api/projects/addUser";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth(loggedUser),
      },
      body: JSON.stringify(newUserToProject),
    })
      .then((response) => {
        if (response.status === 403 || response.status === 400 || response.status === 404) {
          alert("Nie można wykonać akcji, popraw formularz");
        }
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        onUpdate();
        handleClose();
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleClose = () => {
    setEnterOn("");
    setLeaveOn("");
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Dodaj pracownika do projektu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Wybierz projekt:</Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedProject ? selectedProject.name : "Wybierz projekt"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {projects.map((project) => (
                  <Dropdown.Item
                    key={project.uuid}
                    onClick={() => setSelectedProject(project)}
                  >
                    {project.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group>
            <Form.Label>Data startu:</Form.Label>
            <Form.Control
              type="date"
              name="enterOn"
              value={enterOn}
              onChange={(event) => setEnterOn(event.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Data końca:</Form.Label>
            <Form.Control
              type="date"
              name="leaveOn"
              value={leaveOn}
              onChange={(event) => setLeaveOn(event.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Zamknij
        </Button>
        <Button variant="primary" onClick={addUserToProject}>
          Dodaj użytkownika
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
