// src/EmployeeDashboard.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const EmployeeDashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "projects"));
    setProjects(
      querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

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
      <h2 className="text-xl font-bold mt-6 mb-4">現在の案件一覧</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-4 py-2">案件名</th>
            <th className="px-4 py-2">説明</th>
            <th className="px-4 py-2">会社名</th>
            <th className="px-4 py-2">会社住所</th>
            <th className="px-4 py-2">担当者</th>
            <th className="px-4 py-2">締め切り</th>
            <th className="px-4 py-2">状態</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="text-center border">
              <td className="px-4 py-2">{project.title}</td>
              <td className="px-4 py-2">{project.description}</td>
              <td className="px-4 py-2">{project.company}</td>
              <td className="px-4 py-2">{project.address}</td>
              <td className="px-4 py-2">{project.contactPerson}</td>
              <td className="px-4 py-2">{project.deadline}</td>
              <td className="px-4 py-2">{project.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDashboard;
