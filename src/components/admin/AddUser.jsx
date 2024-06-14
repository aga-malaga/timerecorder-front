import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import "./AddUser.css";
import { useAuth } from "../context/AuthContext";
import { basicAuth } from "../common/basicAuth";

export const AddUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [login, setLogin] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [costPerHour, setCostPerHour] = useState(0);

  const Auth = useAuth();
  const user = Auth.getUser();

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const addNewUser = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const newUser = {
      name: name,
      surname: surname,
      login: login,
      role: role,
      email: email,
      password: password,
      costPerHour: costPerHour,
    };

    const url = "http://localhost:8080/api/users";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth(user)
      },
      body: JSON.stringify(newUser),
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
        Dodaj użytkownika
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
            Dodaj użytkownika
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div>
              <Form.Group className="mb-3">
                <Form.Label>Imię:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Nazwisko:</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={surname}
                  onChange={(event) => setSurname(event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Login:</Form.Label>
                <Form.Control
                  type="text"
                  name="login"
                  value={login}
                  onChange={(event) => setLogin(event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Stanowisko:</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    label="Administrator"
                    name="role"
                    checked={role === "ADMIN"}
                    onChange={() => setRole("ADMIN")}
                    className="radio-label"
                  />
                  <Form.Check
                    type="radio"
                    label="Manager"
                    name="role"
                    checked={role === "MANAGER"}
                    onChange={() => setRole("MANAGER")}
                    className="radio-label"
                  />
                  <Form.Check
                    type="radio"
                    label="Pracownik"
                    name="role"
                    checked={role === "EMPLOYEE"}
                    onChange={() => setRole("EMPLOYEE")}
                    className="radio-label"
                  />
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Hasło:</Form.Label>
                <Form.Control
                  type="text"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Koszt za godzinę:</Form.Label>
                <Form.Control
                  type="number"
                  name="costPerHour"
                  value={costPerHour}
                  onChange={(event) => setCostPerHour(event.target.value)}
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Zamknij
          </Button>
          <Button variant="primary" onClick={(event) => addNewUser(event)}>
            Dodaj użytkownika
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
