import React, { useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const Auth = useAuth();
  const [redirectToHome, setRedirectToHome] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const user = {
      login: username,
      password: password,
    };

    if (!username || !password) {
      alert("Wszystkie pola wymagane");
      return;
    }

    try {
      const url = "http://localhost:8080/api/authenticate";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      if (response.ok) {
        const data = await response.json();
        const { uuid, login, role } = data;
        const authdata = window.btoa(username + ":" + password);
        const authenticatedUser = { uuid, login, role, authdata };
        Auth.userLogin(authenticatedUser);
        setUsername("");
        setPassword("");
  
        setRedirectToHome(true);
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (redirectToHome) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  return (
    <div>
      <h1>Login</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Login:</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Hasło:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={(event) => handleLogin(event)}>
          Zaloguj
        </Button>
      </Form>
    </div>
  );
};

export default Login;
