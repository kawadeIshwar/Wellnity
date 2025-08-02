import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [publishingId, setPublishingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const nav = useNavigate();

  const fetchSessions = async () => {
    try {
      const res = await axios.get("/my-sessions");
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions", err);
    }
  };

  const handlePublishSession = async (id, title) => {
    try {
      setPublishingId(id);
      await axios.post("/my-sessions/publish", { sessionId: id });
      alert(`Published: ${title}`);
      fetchSessions();
    } catch (err) {
      alert("Error publishing session");
    } finally {
      setPublishingId(null);
    }
  };

  const handleDeleteSession = async (id, title) => {
    try {
      if (!window.confirm(`Delete "${title}"?`)) return;
      setDeletingId(id);
      await axios.delete(`/my-sessions/${id}`);
      alert("Deleted");
      fetchSessions();
    } catch (err) {
      alert("Error deleting session");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Sessions</h1>
        </div>


        {sessions.length === 0 ? (
          <p className="text-gray-600 text-center">No sessions created yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {sessions.map((s) => (
              <div
                key={s._id}
                className="w-full border p-4 rounded-xl shadow-xl bg-gradient-to-tr from-indigo-400 to-purple-500 transition-transform hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {s.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Status:{" "}
                  <span className="font-medium text-gray-900">{s.status}</span>
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => nav(`/edit/${s._id}`)}
                  >
                    Edit
                  </button>

                  {s.status === "draft" && (
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handlePublishSession(s._id, s.title)}
                      disabled={publishingId === s._id}
                    >
                      {publishingId === s._id ? "Publishing..." : "Publish"}
                    </button>
                  )}

                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDeleteSession(s._id, s.title)}
                    disabled={deletingId === s._id}
                  >
                    {deletingId === s._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySessions;
