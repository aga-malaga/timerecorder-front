import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { basicAuth } from "../common/basicAuth";

export const Records = () => {
  const [appState, setAppState] = useState({ records: [] });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const Auth = useAuth();
  const loggedUser = Auth.getUser();

  const fetchRecords = () => {
    const url = "http://localhost:8080/api/records?userUuid=" + loggedUser.uuid;
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: basicAuth(loggedUser),
      },
    })
    .then((response) => {
        if (response.status === 403 || response.status === 400 || response.status === 404) {
          alert("Brak rekordów");
        }
      })
      .then((data) => data.json())
      .then((response) => setAppState({ records: response.content }))
      .catch((error) => console.error("Error fetching records data:", error));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const removeRecord = (event, uuid) => {
    const url = "http://localhost:8080/api/projects?uuid=" + uuid;

    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: basicAuth(loggedUser),
      },
    })
      .then((response) => {
        if (response.ok) {
          fetchRecords();
        } else {
          console.error("Failed to delete user");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleShowUpdateModal = (record) => {
    setSelectedRecord(record);
    setShowUpdateModal(true);
  };

  const handleHideUpdateModal = () => {
    setSelectedRecord(null);
    setShowUpdateModal(false);
    fetchRecords();
  };

  const handleUpdateComplete = () => {
    handleHideUpdateModal();
    fetchRecords();
  };

  return (
    <>
      <Table striped border hover>
        <thead>
          <tr>
            <th>Od</th>
            <th>Do</th>
            <th>Projekt</th>
          </tr>
        </thead>
        <tbody>
          {appState.records.map((record, index) => {
            return (
              <tr key={index}>
                <td>{record.start}</td>
                <td>{record.stop}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={(event) => removeRecord(event, record.uuid)}
                  >
                    Usuń
                  </Button>
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleShowUpdateModal(record)}
                  >
                    Edytuj
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* {selectedRecord && (
        <UpdateProject
          show={showUpdateModal}
          onHide={handleHideUpdateModal}
          onUpdate={handleUpdateComplete}
          project={selectedRecord}
        />
      )} */}
    </>
  );
};
