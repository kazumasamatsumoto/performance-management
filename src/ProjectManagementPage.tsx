import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#653CA0"];

interface ProjectData {
  name: string;
  value: number;
  percentage: string;
}

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
            const hours = parseFloat(record.hours);
            if (isNaN(hours)) {
              console.error(`Invalid hours: ${record.hours}`);
              return;
            }

            fetchedRecords.push({
              user: userId,
              project: record.project,
              hours,
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
  const recordsFiltered = records.filter(
    (record) =>
      (selectedProject === "" || record.project === selectedProject) &&
      (selectedUser === "" || record.user === selectedUser) &&
      dateInRange(record.date, startDate, endDate)
  );
  const totalTime = recordsFiltered.reduce((acc, curr) => acc + curr.hours, 0);

  const projectHours = recordsFiltered.reduce(
    (acc: { [key: string]: number }, curr: any) => {
      if (!acc[curr.project]) {
        acc[curr.project] = 0;
      }
      acc[curr.project] += curr.hours;
      return acc;
    },
    {}
  );

  const projectData: ProjectData[] = Object.entries(projectHours).map(
    ([key, value]) => ({
      name: key,
      value: value,
      percentage: ((value / totalTime) * 100).toFixed(2),
    })
  );

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
          <label htmlFor="project-select" className="block mb-2">
            案件:
          </label>
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
          <label htmlFor="user-select" className="block mb-2">
            ユーザー:
          </label>
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
          <label htmlFor="start-date" className="block mb-2">
            開始日:
          </label>
          <input
            type="date"
            id="start-date"
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="end-date" className="block mb-2">
            終了日:
          </label>
          <input
            type="date"
            id="end-date"
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <div>
        <h2 className="text-xl mb-4">案件ごとの集計時間</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-4 py-2">案件</th>
              <th className="px-4 py-2">時間</th>
              <th className="px-4 py-2">全体からの割合</th>
            </tr>
          </thead>
          <tbody>
            {projectData.map((project, index) => (
              <tr key={index} className="text-center border">
                <td className="px-4 py-2">{project.name}</td>
                <td className="px-4 py-2">{project.value} 時間</td>
                <td className="px-4 py-2">{project.percentage} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-white rounded shadow">
        <div className="flex justify-center">
          <h2 className="text-xl font-bold mb-4">案件ごとの割合（グラフ）</h2>
        </div>
        <div className="flex justify-center">
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={projectData.map((entry, index) => ({
                ...entry,
                fill: COLORS[index % COLORS.length],
              }))}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            />
            <Tooltip />
            <Legend />
          </PieChart>
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
