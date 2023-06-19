// src/AdminDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">管理者ダッシュボード</h1>
      <ul className="list-disc pl-5">
        <li className="mb-2">
          <Link className="text-blue-500 hover:text-blue-700" to="/admin/employee-management">人員管理</Link>
        </li>
        <li className="mb-2">
          <Link className="text-blue-500 hover:text-blue-700" to="/admin/case-management">案件管理</Link>
        </li>
        <li className="mb-2">
          <Link className="text-blue-500 hover:text-blue-700" to="/admin/task-management">与実管理</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
