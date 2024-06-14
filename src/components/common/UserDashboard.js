import React from "react";
import { useAuth } from "../context/AuthContext";
import { AdminDashboard } from "../admin/AdminDashboard";
import EmployeeDashboard from "../employee/EmployeeDashboard";

const UserDashboard = () => {
  const { getUser } = useAuth();
  const user = getUser();

  if (user.role === "ADMIN") {
    return <AdminDashboard />;
  } else if (user.role === "EMPLOYEE") {
    return <EmployeeDashboard />;
  } else {
    return <div>Unauthorized access</div>;
  }
};

export default UserDashboard;
