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
    <div className="p-4">
      <h1 className="text-2xl mb-4">管理者ログイン</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700">ログイン</button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
