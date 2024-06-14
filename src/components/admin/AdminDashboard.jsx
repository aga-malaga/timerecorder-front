import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import React, { useState } from "react";

import { Users } from "./Users";
import { AddUser } from "./AddUser";
import { AddProject } from "./AddProject";
import { Projects } from "./Projects";

export const AdminDashboard = () => {

  return (
    <>
      <Users />
      <AddUser />
      <Projects />
      <AddProject />
    </>
  );
};
