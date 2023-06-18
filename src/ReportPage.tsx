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
    <div>
      <h1>稼働報告ページ</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {records.map((record, index) => (
        <div key={index}>
          <select
            name="project"
            value={record.project}
            onChange={(event) => handleInputChange(index, event)}
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
          />
          時間
        </div>
      ))}
      <button onClick={handleAddFields}>行を追加</button>
      <button onClick={handleSave}>保存</button>
      <Link to="/employee-dashboard">トップに戻る</Link>
      <h2>過去の記録</h2>
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>案件</th>
            <th>時間</th>
          </tr>
        </thead>
        <tbody>
          {pastRecords.map((record, index) => (
            <React.Fragment key={index}>
              {record.records.map((item: any, i: any) => (
                <tr key={i}>
                  {i === 0 && (
                    <td rowSpan={record.records.length}>{record.date}</td>
                  )}
                  <td>{item.project}</td>
                  <td>{item.hours}時間</td>
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
