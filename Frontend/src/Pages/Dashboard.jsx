import { useEffect, useState } from "react";
import axios from "../api/axios";

function Dashboard() {
  const [sessions, setSessions] = useState([]);

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
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4">
     <h1
  className="text-4xl font-bold mb-8 text-center text-purple-950 py-2 px-36" 
  style={{ textShadow: '2px 2px  rgba(173, 216, 230, 1) ' }}>
  Public Wellness Sessions
  
</h1>


      {sessions.length === 0 ? (
        <p className="text-gray-800">Loading Sessions Please wait...</p>
      ) : (
        <div className="flex flex-col gap-4 items-center w-full max-w-2xl">
          {sessions.map((s) => (
            <div
              key={s._id}
              className="w-full p-4 rounded-xl shadow-xl b text-purple-950 transition-transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold">{s.title}</h2>
              <p className="text-sm text-purple-950">Tags: {s.tags.join(", ")}</p>
              <a
                href={s.json_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 inline-block"
              >
                View JSON
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;