import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { UpdateProject } from "./UpdateProject";
import { useAuth } from "../context/AuthContext";
import { basicAuth } from "../common/basicAuth";

export const Projects = () => {
  const [appState, setAppState] = useState({ projects: [] });
  const [selectedProject, setSelectedProject] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const Auth = useAuth();
  const loggedUser = Auth.getUser();

  const fetchProjectData = () => {
    const url = "http://localhost:8080/api/projects";
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: basicAuth(loggedUser),
      },
    })
      .then((data) => data.json())
      .then((response) => setAppState({ projects: response.content }))
      .catch((error) => console.error("Error fetching projects data:", error));
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const removeProject = (event, uuid) => {
    const url = "http://localhost:8080/api/projects?uuid=" + uuid;

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: basicAuth(loggedUser),
      },
    })
    .then((response) => {
      if (response.status === 403 || response.status === 400 || response.status === 404) {
        alert("Nie można wykonać akcji");
      }
    })
      .then((response) => {
        if (response.ok) {
          fetchProjectData();
        } else {
          console.error("Failed to delete user");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleShowUpdateModal = (project) => {
    setSelectedProject(project);
    setShowUpdateModal(true);
  };

  const handleHideUpdateModal = () => {
    setSelectedProject(null);
    setShowUpdateModal(false);
    fetchProjectData();
  };

  const handleUpdateComplete = () => {
    handleHideUpdateModal();
    fetchProjectData();
  };

  return (
    <>
      <Table striped border hover>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Opis</th>
            <th>Data startu</th>
            <th>Data końca</th>
            <th>Budżet</th>
            <th>% zużycia budżetu</th>
            <th>Pracownicy</th>
          </tr>
        </thead>
        <tbody>
          {appState.projects.map((project, index) => {
            const userDTO = project.userDTO || [];
            return (
              <tr key={index}>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>{project.start}</td>
                <td>{project.stop}</td>
                <td>{project.budget}</td>
                <td>{project.budgetPercent}</td>
                <td>
                  {userDTO.map((user, index) => (
                    <span key={index}>
                      {user.name} {user.surname}
                      {index < userDTO.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={(event) => removeProject(event, project.uuid)}
                  >
                    Usuń
                  </Button>
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleShowUpdateModal(project)}
                  >
                    Edytuj
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {selectedProject && (
        <UpdateProject
          show={showUpdateModal}
          onHide={handleHideUpdateModal}
          onUpdate={handleUpdateComplete}
          project={selectedProject}
        />
      )}
    </>
  );
};
