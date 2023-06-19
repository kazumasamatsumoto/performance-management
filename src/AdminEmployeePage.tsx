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
    <div className="p-4">
      <button
        onClick={() => navigate("/admin-dashboard")}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        戻る
      </button>
      <h1 className="text-2xl mb-4">人員管理</h1>

      {/* Update Employee */}
      {isEditing && (
        <div className="space-y-4 mb-8">
          <h2 className="text-xl mb-2">従業員情報を更新</h2>
          <input
            type="text"
            placeholder="Name"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Age"
            value={editingAge}
            onChange={(e) => setEditingAge(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Skills"
            value={editingSkills}
            onChange={(e) => setEditingSkills(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Future Direction"
            value={editingFutureDirection}
            onChange={(e) => setEditingFutureDirection(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleUpdateEmployee}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            更新
          </button>
        </div>
      )}

      {/* List Employees */}
      <div>
        <h2 className="text-xl mb-4">従業員一覧</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Skills</th>
              <th className="px-4 py-2">Future Direction</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="text-center border">
                <td className="px-4 py-2">{employee.name}</td>
                <td className="px-4 py-2">{employee.age}</td>
                <td className="px-4 py-2">{employee.skills}</td>
                <td className="px-4 py-2">{employee.futureDirection}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingId(employee.id);
                      setEditingName(employee.name);
                      setEditingAge(employee.age);
                      setEditingSkills(employee.skills);
                      setEditingFutureDirection(employee.futureDirection);
                    }}
                    className="bg-yellow-500 text-white py-1 px-2 mr-2 rounded hover:bg-yellow-700"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
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
    </div>
  );
};

export default AdminEmployeePage;
