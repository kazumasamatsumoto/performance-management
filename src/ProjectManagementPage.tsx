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
    <div className="p-4">
      <button
        onClick={() => navigate("/admin-dashboard")}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        戻る
      </button>

      <h1 className="text-2xl mb-4">与実管理</h1>

      <div className="flex space-x-4 mb-8">
        <div>
          <label htmlFor="project-select" className="block mb-2">案件:</label>
          <select
            id="project-select"
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">すべての案件</option>
            {projects.map((project, index) => (
              <option key={index} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="user-select" className="block mb-2">ユーザー:</label>
          <select
            id="user-select"
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">すべてのユーザー</option>
            {users.map((user, index) => (
              <option key={index} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="start-date" className="block mb-2">開始日:</label>
          <input
            type="date"
            id="start-date"
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="end-date" className="block mb-2">終了日:</label>
          <input
            type="date"
            id="end-date"
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-4 py-2">ユーザー</th>
            <th className="px-4 py-2">日付</th>
            <th className="px-4 py-2">案件</th>
            <th className="px-4 py-2">時間</th>
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
              <tr key={index} className="text-center border">
                <td className="px-4 py-2">{record.user}</td>
                <td className="px-4 py-2">{record.date}</td>
                <td className="px-4 py-2">{record.project}</td>
                <td className="px-4 py-2">{record.hours} 時間</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectManagementPage;
