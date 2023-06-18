// src/AdminLoginPage.tsx
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      user.getIdTokenResult().then((idTokenResult) => {
        if (!!idTokenResult.claims.admin) {
          navigate("/admin-dashboard");
        } else {
          // ログアウト処理を実行
          signOut(auth)
            .then(() => {
              alert("管理者権限がありません。ログアウトされました。");
            })
            .catch((error) => {
              console.error("ログアウトに失敗しました。", error);
            });
        }
      });
    } catch (error) {
      alert("ログインに失敗しました");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>管理者ログイン</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
