import React, { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { basicAuth } from "../common/basicAuth";

export const UpdateUser = (props) => {
  const [name, setName] = useState(props.user.name);
  const [surname, setSurname] = useState(props.user.surname);
  const [login, setLogin] = useState(props.user.login);
  const [role, setRole] = useState(props.user.role);
  const [email, setEmail] = useState(props.user.email);
  const [password, setPassword] = useState(props.user.password);
  const [costPerHour, setCostPerHour] = useState(props.user.costPerHour);

  const Auth = useAuth();
  const loggedUser = Auth.getUser();

  const updateUser = (event, uuid) => {
    event.preventDefault();
    event.stopPropagation();

    const user = {
      userUuid: props.user.uuid,
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
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth(loggedUser),
      },
      body: JSON.stringify(user),
    })
    .then((response) => {
      if (response.status === 403 || response.status === 400 || response.status === 404) {
        alert("Nie można wykonać akcji, popraw formularz");
      }
    })
      .then(() => {
        props.onHide();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Edytuj użytkownika</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Form.Label>Surname:</Form.Label>
            <Form.Control
              type="text"
              name="surname"
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
            />
            <Form.Label>Login:</Form.Label>
            <Form.Control
              type="text"
              name="login"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
            />
            <Form.Label>Role:</Form.Label>
            <Form.Control
              type="text"
              name="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            />
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="text"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Form.Label>Cost per hour:</Form.Label>
            <Form.Control
              type="number"
              name="costPerHour"
              value={costPerHour}
              onChange={(event) => setCostPerHour(event.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Anuluj
          </Button>
          <Button variant="primary" onClick={updateUser}>
            Edytuj użytkownika
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
