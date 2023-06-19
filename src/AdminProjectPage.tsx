// src/AdminProjectPage.tsx
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminProjectPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

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

  const handleAddProject = async () => {
    const db = getFirestore();
    await addDoc(collection(db, "projects"), {
      title,
      description,
      company,
      address,
      contactPerson,
      deadline,
      status,
    });
    setTitle("");
    setDescription("");
    setCompany("");
    setAddress("");
    setContactPerson("");
    setDeadline("");
    setStatus("");
    fetchProjects();
  };

  const handleDeleteProject = async (id: string) => {
    const db = getFirestore();
    await deleteDoc(doc(db, "projects", id));
    fetchProjects();
  };

  return (
    <div className="p-4">
      <button
        onClick={() => navigate("/admin-dashboard")}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        戻る
      </button>

      <h1 className="text-2xl mb-4">案件管理</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddProject();
        }}
        className="space-y-4 mb-8"
      >
        <input
          type="text"
          placeholder="案件名"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="会社名"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="会社住所"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="担当者"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          placeholder="締め切り"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          案件追加
        </button>
      </form>

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
            <th className="px-4 py-2">操作</th>
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
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProjectPage;
