// src/Navbar.tsx
import React from "react";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "./firebase";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        Logged in as {user.email}
        <button onClick={handleLogout}>ログアウト</button>
      </div>
    );
  }

  return null;
};

export default Navbar;