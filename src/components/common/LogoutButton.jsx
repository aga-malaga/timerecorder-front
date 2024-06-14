import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";
import { Button } from "react-bootstrap";

const LogoutButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState("true");
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    navigate("/login");
  }

  return (
    <Button variant="outline-danger" onClick={handleLogout}>
      Log out
    </Button>
  );
};

export default LogoutButton;
