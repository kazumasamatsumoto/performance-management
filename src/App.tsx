// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import EmployeeLoginPage from "./EmployeeLoginPage";
import EmployeeDashboard from "./EmployeeDashboard";
import Navbar from "./Navbar";
import ProfilePage from "./ProfilePage";
import ReportPage from "./ReportPage"; // 追加
import AdminLoginPage from "./AdminLoginPage";
import AdminEmployeePage from "./AdminEmployeePage";
import AdminDashboard from "./AdminDashboard";
import AdminProjectPage from "./AdminProjectPage";
import ProjectManagementPage from "./ProjectManagementPage"; // 追加

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/employee-login" element={<EmployeeLoginPage />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-employee" element={<AdminEmployeePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/employee-management"
          element={<AdminEmployeePage />}
        />
        <Route path="/admin/case-management" element={<AdminProjectPage />} />
        <Route
          path="/admin/task-management"
          element={<ProjectManagementPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
