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
} from "firebase/firestore";
import { Link } from "react-router-dom";

const ReportPage = () => {
  const [user] = useAuthState(auth);
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([{ project: "", hours: "" }]);
  const [pastRecords, setPastRecords] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]); // 追加

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

  const fetchPastRecords = useCallback(async () => {
    if (user) {
      const q = query(
        collection(db, "users", user.uid, "records"),
        orderBy("date")
      );
      const querySnapshot = await getDocs(q);
      setPastRecords(querySnapshot.docs.map((doc) => doc.data()));
    }
  }, [user]);

  // 追加：案件をフェッチする
  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    setProjects(
      querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  const handleSave = async () => {
    if (user && date) {
      const docRef = await addDoc(
        collection(db, "users", user.uid, "records"),
        {
          date,
          records,
        }
      );
      console.log(docRef)
      fetchPastRecords();
    }
  };
  // これを追加
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
        className="mb-4 p-2 border border-gray-300 rounded"
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
          </tr>
        </thead>
        <tbody>
          {pastRecords.map((record, index) => (
            <React.Fragment key={index}>
              {record.records.map((item: any, i: any) => (
                <tr key={i} className="text-center border">
                  {i === 0 && (
                    <td className="px-4 py-2" rowSpan={record.records.length}>{record.date}</td>
                  )}
                  <td className="px-4 py-2">{item.project}</td>
                  <td className="px-4 py-2">{item.hours}時間</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default ReportPage;
