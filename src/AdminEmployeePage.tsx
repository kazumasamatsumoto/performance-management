// src/AdminEmployeePage.tsx
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminEmployeePage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<any[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [editingAge, setEditingAge] = useState("");
  const [editingSkills, setEditingSkills] = useState("");
  const [editingFutureDirection, setEditingFutureDirection] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "users"));
    const employees = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEmployees(employees);
  };

  const handleUpdateEmployee = async () => {
    const db = getFirestore();
    await updateDoc(doc(db, "users", editingId), {
      name: editingName,
      age: editingAge,
      skills: editingSkills,
      futureDirection: editingFutureDirection,
    });
    setIsEditing(false);
    fetchEmployees();
  };

  const handleDeleteEmployee = async (id: string) => {
    const db = getFirestore();
    await deleteDoc(doc(db, "users", id));
    fetchEmployees();
  };

  return (
    <div>
      <button onClick={() => navigate("/admin-dashboard")}>戻る</button>
      <h1>人員管理</h1>

      {/* Update Employee */}
      {isEditing && (
        <div>
          <h2>従業員情報を更新</h2>
          <input
            type="text"
            placeholder="Name"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Age"
            value={editingAge}
            onChange={(e) => setEditingAge(e.target.value)}
          />
          <input
            type="text"
            placeholder="Skills"
            value={editingSkills}
            onChange={(e) => setEditingSkills(e.target.value)}
          />
          <input
            type="text"
            placeholder="Future Direction"
            value={editingFutureDirection}
            onChange={(e) => setEditingFutureDirection(e.target.value)}
          />
          <button onClick={handleUpdateEmployee}>更新</button>
        </div>
      )}

      {/* List Employees */}
      <div>
        <h2>従業員一覧</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Skills</th>
              <th>Future Direction</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.age}</td>
                <td>{employee.skills}</td>
                <td>{employee.futureDirection}</td>
                <td>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingId(employee.id);
                      setEditingName(employee.name);
                      setEditingAge(employee.age);
                      setEditingSkills(employee.skills);
                      setEditingFutureDirection(employee.futureDirection);
                    }}
                  >
                    編集
                  </button>
                  <button onClick={() => handleDeleteEmployee(employee.id)}>
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEmployeePage;
