// src/ReportPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "./firebase";
import auth from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const ReportPage = () => {
  const [user] = useAuthState(auth);
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([{ project: "", hours: "" }]);
  const [pastRecords, setPastRecords] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingRecord, setEditingRecord] = useState<{
    id: string | null;
    data: any | null;
  }>({ id: null, data: null });

  const handleInputChange = (index: any, event: any) => {
    const values = [...records];
    if (event.target.name === "project") {
      values[index].project = event.target.value;
    } else {
      values[index].hours = event.target.value;
    }
    setRecords(values);
  };

  const handleAddFields = () => {
    setRecords([...records, { project: "", hours: "" }]);
  };

  const handleDelete = async (recordId: string) => {
    if (user) {
      await deleteDoc(doc(db, "users", user.uid, "records", recordId));
      fetchPastRecords();
    }
  };

  const handleEdit = async () => {
    if (user && editingRecord.id && editingRecord.data) {
      await updateDoc(
        doc(db, "users", user.uid, "records", editingRecord.id),
        editingRecord.data
      );
      fetchPastRecords();
      setEditingRecord({ id: null, data: null });
    }
  };

  const fetchPastRecords = useCallback(async () => {
    if (user) {
      const q = query(
        collection(db, "users", user.uid, "records"),
        orderBy("date")
      );
      const querySnapshot = await getDocs(q);
      setPastRecords(
        querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      );
    }
  }, [user]);

  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    setProjects(
      querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  const handleSave = async () => {
    if (user && date) {
      await addDoc(collection(db, "users", user.uid, "records"), {
        date,
        records,
      });
      fetchPastRecords();
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchPastRecords();
  }, [fetchPastRecords]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">稼働報告ページ</h1>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-4 p-2
        border-gray-300 rounded"
      />

      {records.map((record, index) => (
        <div key={index} className="flex space-x-4 mb-4">
          <select
            name="project"
            value={record.project}
            onChange={(event) => handleInputChange(index, event)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">案件を選択してください</option>
            {projects.map((project) => (
              <option key={project.id} value={project.title}>
                {project.title}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="hours"
            step="0.5"
            value={record.hours}
            onChange={(event) => handleInputChange(index, event)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <span className="self-center">時間</span>
        </div>
      ))}

      <button
        onClick={handleAddFields}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        行を追加
      </button>

      <button
        onClick={handleSave}
        className="mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        保存
      </button>

      <Link
        to="/employee-dashboard"
        className="mb-4 inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
      >
        トップに戻る
      </Link>

      <h2 className="text-xl mb-4">過去の記録</h2>

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-4 py-2">日付</th>
            <th className="px-4 py-2">案件</th>
            <th className="px-4 py-2">時間</th>
            <th className="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {pastRecords.map((record, index) => (
            <React.Fragment key={index}>
              {record.data.records.map((item: any, i: any) => (
                <tr key={i} className="text-center border">
                  {i === 0 && (
                    <td
                      className="px-4 py-2"
                      rowSpan={record.data.records.length}
                    >
                      {record.data.date}
                    </td>
                  )}
                  <td className="px-4 py-2">{item.project}</td>
                  <td className="px-4 py-2">{item.hours}時間</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setEditingRecord(record)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-700"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 ml-2"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {editingRecord.id && (
        <div className="p-4 mb-4 border border-gray-300 rounded">
          <h3 className="text-lg mb-2">Record editing:</h3>

          <label className="block">
            <span className="text-gray-700">Date:</span>
            <input
              type="date"
              value={editingRecord.data.date}
              onChange={(e) =>
                setEditingRecord((prev) => ({
                  ...prev,
                  data: { ...prev.data, date: e.target.value },
                }))
              }
              className="w-full mt-1 p-2 mb-2 border border-gray-300 rounded"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Project:</span>
            <input
              type="text"
              value={editingRecord.data.records[0].project}
              onChange={(e) =>
                setEditingRecord((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    records: [
                      {
                        project: e.target.value,
                        hours: prev.data.records[0].hours,
                      },
                    ],
                  },
                }))
              }
              className="w-full mt-1 p-2 mb-2 border border-gray-300 rounded"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Hours:</span>
            <input
              type="number"
              step="0.5"
              value={editingRecord.data.records[0].hours}
              onChange={(e) =>
                setEditingRecord((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    records: [
                      {
                        project: prev.data.records[0].project,
                        hours: e.target.value,
                      },
                    ],
                  },
                }))
              }
              className="w-full mt-1 p-2 mb-2 border border-gray-300 rounded"
            />
          </label>

          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Update
            </button>
            <button
              onClick={() => setEditingRecord({ id: null, data: null })}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
