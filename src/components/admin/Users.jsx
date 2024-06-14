import React, { useEffect, useState } from "react";
import { UpdateUser } from "./UpdateUser";
import { AddUserToProject } from "./AddUserToProject";
import { Table, Button } from "react-bootstrap";

import { useAuth } from "../context/AuthContext"; // Adjust the path as per your project structure
import { basicAuth } from "../common/basicAuth";

export const Users = () => {
  const [appState, setAppState] = useState({ users: [] });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddUserToProjectModal, setShowAddUserToProjectModal] =
    useState(false);

  const Auth = useAuth();
  const loggedUser = Auth.getUser();

  const fetchUserData = () => {
    const url = "http://localhost:8080/api/users";
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: basicAuth(loggedUser),
      },
    })
      .then((data) => data.json())
      .then((response) => setAppState({ users: response.content }))
      .catch((error) => console.error("Error fetching user data:", error));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const removeUser = (event, uuid) => {
    const url = "http://localhost:8080/api/users?uuid=" + uuid;

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: basicAuth(loggedUser),
      },
    })
      .then((response) => {
        if (response.ok) {
          fetchUserData();
        } else {
          console.error("Failed to delete user");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleShowUpdateModal = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleShowAddUserToProjectModal = (user) => {
    setSelectedUser(user);
    setShowAddUserToProjectModal(true);
  };

  const handleHideUpdateModal = () => {
    setSelectedUser(null);
    setShowUpdateModal(false);
    fetchUserData();
  };

  const handleHideAddUserToProjectModal = () => {
    setSelectedUser(null);
    setShowAddUserToProjectModal(false);
    fetchUserData();
  };

  const handleUpdateComplete = () => {
    handleHideUpdateModal();
    fetchUserData();
  };

  const handleAddingComplete = () => {
    handleHideAddUserToProjectModal();
    fetchUserData();
  };

  return (
    <>
      <Table striped border hover>
        <thead>
          <tr>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Login</th>
            <th>Email</th>
            <th>Koszt za godzinę</th>
            <th>Projekt</th>
          </tr>
        </thead>
        <tbody>
          {appState.users?.map((user, index) => {
            return (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.login}</td>
                <td>{user.email}</td>
                <td>{user.costPerHour}</td>
                <td>{user.projectName.join(", ")}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={(event) => removeUser(event, user.uuid)}
                  >
                    Usuń
                  </Button>
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleShowUpdateModal(user)}
                  >
                    Edytuj
                  </Button>
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleShowAddUserToProjectModal(user)}
                  >
                    Dodaj do projektu
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {selectedUser && (
        <UpdateUser
          show={showUpdateModal}
          onHide={handleHideUpdateModal}
          onUpdate={handleUpdateComplete}
          user={selectedUser}
        />
      )}

      {selectedUser && (
        <AddUserToProject
          show={showAddUserToProjectModal}
          onHide={handleHideAddUserToProjectModal}
          onUpdate={handleAddingComplete}
          user={selectedUser}
        />
      )}
    </>
  );
};
