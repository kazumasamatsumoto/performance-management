// src/EmployeeLoginPage.tsx
import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import auth from "./firebase"; // Import auth instance

const EmployeeLoginPage = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/employee-dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (user) {
    return (
      <div>
        Logged in as {user.email}
        <button onClick={handleLogout}>ログアウト</button>
      </div>
    );
  }

  return (
    <div>
      <h1>従業員ログイン</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>ログイン</button>
    </div>
  );
};

export default EmployeeLoginPage;
