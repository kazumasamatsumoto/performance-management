// src/AdminDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <h1>管理者ダッシュボード</h1>
      <ul>
        <li>
          <Link to="/admin/employee-management">人員管理</Link>
        </li>
        <li>
          <Link to="/admin/case-management">案件管理</Link>
        </li>
        <li>
          <Link to="/admin/task-management">与実管理</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
