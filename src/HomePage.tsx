// src/HomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleEmployeeLogin = () => {
    navigate("/employee-login");
  };

  const handleAdminLogin = () => {
    navigate("/admin-login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <button
        onClick={handleEmployeeLogin}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      >
        従業員ログイン
      </button>
      <button
        onClick={handleAdminLogin}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      >
        管理者ログイン
      </button>
    </div>
  );
};

export default HomePage;
