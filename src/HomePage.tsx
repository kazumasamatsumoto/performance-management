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
    <div>
      <button onClick={handleEmployeeLogin}>従業員ログイン</button>
      <button onClick={handleAdminLogin}>管理者ログイン</button>
    </div>
  );
};

export default HomePage;
