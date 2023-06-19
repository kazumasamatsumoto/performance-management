// src/EmployeeDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";

const EmployeeDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">従業員ダッシュボード</h1>
      <Link
        to="/profile"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-700 transition-colors duration-300"
      >
        プロフィールページ
      </Link>{" "}
      {/* プロフィールページへのリンク */}
      <Link
        to="/report"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
      >
        稼働報告ページ
      </Link>{" "}
      {/* 稼働報告ページへのリンク */}
    </div>
  );
};

export default EmployeeDashboard;
