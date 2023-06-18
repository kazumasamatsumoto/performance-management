// src/EmployeeDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";

const EmployeeDashboard = () => {
  return (
    <div>
      <h1>従業員ダッシュボード</h1>
      <Link to="/profile">プロフィールページ</Link>{" "}
      {/* プロフィールページへのリンク */}
      <Link to="/report">稼働報告ページ</Link> {/* 稼働報告ページへのリンク */}
    </div>
  );
};

export default EmployeeDashboard;
