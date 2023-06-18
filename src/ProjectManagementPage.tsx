import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ProjectManagementPage = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      const userCollection = collection(db, "users");
      const userSnapshot = await getDocs(userCollection);

      const fetchedRecords: any[] = [];
      const fetchedUsers: any[] = [];

      for (let userDoc of userSnapshot.docs) {
        const userId = userDoc.id;
        fetchedUsers.push(userId);

        const recordsRef = collection(db, "users", userId, "records");
        const recordsQuery = query(recordsRef, orderBy("date"));
        const recordsSnapshot = await getDocs(recordsQuery);

        recordsSnapshot.forEach((recordDoc) => {
          const recordData = recordDoc.data();
          recordData.records.forEach((record: any) => {
            fetchedRecords.push({
              user: userId,
              project: record.project,
              hours: record.hours,
              date: recordData.date,
            });
          });
        });
      }

      setRecords(fetchedRecords);
      setUsers(fetchedUsers);
    };

    const fetchProjects = async () => {
      const projectCollection = collection(db, "projects");
      const projectSnapshot = await getDocs(projectCollection);
      const projectList = projectSnapshot.docs.map((doc) => doc.data().title);
      setProjects(projectList);
    };

    fetchRecords();
    fetchProjects();
  }, []);

  const dateInRange = (date: string, start: string, end: string) => {
    if (start && end) {
      return date >= start && date <= end;
    } else if (start) {
      return date >= start;
    } else if (end) {
      return date <= end;
    }
    return true;
  };

  return (
    <div>
      <button onClick={() => navigate("/admin-dashboard")}>戻る</button>
      <h1>与実管理</h1>

      <label htmlFor="project-select">案件:</label>
      <select
        id="project-select"
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        <option value="">すべての案件</option>
        {projects.map((project, index) => (
          <option key={index} value={project}>
            {project}
          </option>
        ))}
      </select>

      <label htmlFor="user-select" style={{ marginLeft: "10px" }}>
        ユーザー:
      </label>
      <select
        id="user-select"
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">すべてのユーザー</option>
        {users.map((user, index) => (
          <option key={index} value={user}>
            {user}
          </option>
        ))}
      </select>

      <label htmlFor="start-date" style={{ marginLeft: "10px" }}>
        開始日:
      </label>
      <input
        type="date"
        id="start-date"
        onChange={(e) => setStartDate(e.target.value)}
      />

      <label htmlFor="end-date" style={{ marginLeft: "10px" }}>
        終了日:
      </label>
      <input
        type="date"
        id="end-date"
        onChange={(e) => setEndDate(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>ユーザー</th>
            <th>日付</th>
            <th>案件</th>
            <th>時間</th>
          </tr>
        </thead>
        <tbody>
          {records
            .filter(
              (record) =>
                (selectedProject === "" ||
                  record.project === selectedProject) &&
                (selectedUser === "" || record.user === selectedUser) &&
                dateInRange(record.date, startDate, endDate)
            )
            .map((record, index) => (
              <tr key={index}>
                <td>{record.user}</td>
                <td>{record.date}</td>
                <td>{record.project}</td>
                <td>{record.hours} 時間</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectManagementPage;
