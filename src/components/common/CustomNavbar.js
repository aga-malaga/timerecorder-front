import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function CustomNavbar() {
  const { getUser, userIsAuthenticated, userLogout } = useAuth();

  const logout = () => {
    userLogout();
  };

  const logoutMenuStyle = () => {
    return userIsAuthenticated() ? { display: "block" } : { display: "none" };
  };

  const getUserName = () => {
    const user = getUser();
    return user ? user.name : "";
  };

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
          <h2>Time Tracker</h2>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {userIsAuthenticated() && (
            <>
              <Navbar.Text>
                Signed in as: {getUserName}
              </Navbar.Text>
              <Button
                onClick={logout}
                variant="outline-danger"
                className="ms-3"
              >
                Logout
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
