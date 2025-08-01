import { useEffect, useState } from "react";
import axios from "../api/axios";

function Dashboard() {
  const [sessions, setSessions] = useState([]);

  // 👇 Fetch function is moved outside useEffect
  const fetchSessions = async () => {
    try {
      const res = await axios.get("/sessions");
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Public Wellness Sessions</h1>
      {sessions.length === 0 ? (
        <p>No published sessions yet.</p>
      ) : (
        sessions.map((s) => (
          <div key={s._id} className="mb-4 border p-3 rounded shadow">
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <p className="text-sm text-gray-600">Tags: {s.tags.join(", ")}</p>
            <a
              href={s.json_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View JSON
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
