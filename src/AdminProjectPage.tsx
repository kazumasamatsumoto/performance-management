// src/AdminProjectPage.tsx
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
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
    <div>
      <button onClick={() => navigate("/admin-dashboard")}>戻る</button>

      <h1>案件管理</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddProject();
        }}
      >
        <input
          type="text"
          placeholder="案件名"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="会社名"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          type="text"
          placeholder="会社住所"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="担当者"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
        />
        <input
          type="date"
          placeholder="締め切り"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">案件追加</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>案件名</th>
            <th>説明</th>
            <th>会社名</th>
            <th>会社住所</th>
            <th>担当者</th>
            <th>締め切り</th>
            <th>状態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>{project.company}</td>
              <td>{project.address}</td>
              <td>{project.contactPerson}</td>
              <td>{project.deadline}</td>
              <td>{project.status}</td>
              <td>
                <button onClick={() => handleDeleteProject(project.id)}>
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
