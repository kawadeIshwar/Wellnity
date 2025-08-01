import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const nav = useNavigate();
  
  // Track active requests to prevent duplicates
  const activeRequests = useRef(new Set());
  
  useEffect(() => {
    // Cleanup active requests on unmount
    return () => {
      activeRequests.current.clear();
    };
  }, []);

  useEffect(() => {
    const fetchMySessions = async () => {
      try {
        const res = await axios.get("/my-sessions");
        setSessions(res.data);
      } catch (err) {
        console.error("Failed to fetch user sessions", err);
        if (err.response?.status === 401) nav("/");
      }
    };

    fetchMySessions();
  }, [nav]);

  const handleCreateNewSession = async () => {
    if (creatingNew) {
      console.log("Session creation already in progress");
      return;
    }
    
    setCreatingNew(true);
    
    try {
      console.log("Attempting to create new session...");
      const response = await axios.post("/my-sessions/create");
      console.log("Create new session response:", response);
      console.log("Response data:", response.data);
      console.log("Session ID:", response.data._id);
      
      // Validate response
      if (!response.data || !response.data._id) {
        throw new Error("Invalid response: missing session ID");
      }
      
      // Navigate to the editor for the new session
      console.log(`Navigating to /edit/${response.data._id}`);
      nav(`/edit/${response.data._id}`);
    } catch (err) {
      console.error("Failed to create new session", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        nav("/");
      } else if (err.response?.status === 500) {
        alert(`Server error: ${err.response?.data?.error || err.response?.data?.msg || 'Unknown server error'}`);
      } else if (err.message) {
        alert(`Error: ${err.message}`);
      } else {
        alert(`Failed to create new session: ${err.response?.data?.msg || 'Unknown error'}`);
      }
    } finally {
      setCreatingNew(false);
    }
  };

  const handlePublishSession = async (sessionId, sessionTitle) => {
    // Prevent multiple publish requests for the same session
    if (publishingId === sessionId) {
      console.log("Publish already in progress for session:", sessionId);
      return;
    }

    const confirmPublish = window.confirm(
      `Are you sure you want to publish the session "${sessionTitle}"?`
    );

    if (!confirmPublish) return;

    setPublishingId(sessionId);

    try {
      const response = await axios.post("/my-sessions/publish", { sessionId });
      console.log("Publish response:", response.data);

      // Update the session with the response data from backend
      setSessions(sessions.map(s => (s._id === sessionId ? response.data : s)));
      alert("Session published successfully!");
    } catch (err) {
      console.error("Failed to publish session", err);

      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        nav("/");
      } else if (err.response?.status === 403) {
        alert("You don't have permission to publish this session.");
      } else if (err.response?.status === 404) {
        alert("Session not found.");
      } else if (err.response?.status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert(`Failed to publish session: ${err.response?.data?.msg || 'Unknown error'}`);
      }
    } finally {
      setPublishingId(null);
    }
  };

  const handleDeleteSession = async (sessionId, sessionTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the session "${sessionTitle}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    setDeletingId(sessionId);
    
    try {
      const response = await axios.delete(`/my-sessions/${sessionId}`);
      console.log("Delete response:", response.data);
      
      // Remove the deleted session from the state
      setSessions(sessions.filter(s => s._id !== sessionId));
      alert("Session deleted successfully!");
    } catch (err) {
      console.error("Failed to delete session", err);
      
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        nav("/");
      } else if (err.response?.status === 403) {
        alert("You don't have permission to delete this session.");
      } else if (err.response?.status === 404) {
        alert("Session not found or already deleted.");
        // Remove from UI anyway since it doesn't exist
        setSessions(sessions.filter(s => s._id !== sessionId));
      } else if (err.response?.status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert(`Failed to delete session: ${err.response?.data?.msg || 'Unknown error'}`);
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">My Sessions</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCreateNewSession}
          disabled={creatingNew}
        >
          {creatingNew ? "Creating..." : "+ New Session"}
        </button>
      </div>
      {sessions.map((s) => (
        <div key={s._id} className="border p-3 rounded shadow mb-3">
          <h2 className="text-lg font-semibold">{s.title}</h2>
          <p>Status: <span className="font-medium">{s.status}</span></p>
          <div className="flex gap-2 mt-2">
            <button
              className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              onClick={() => nav(`/edit/${s._id}`)}
            >
              Edit
            </button>
            {s.status === "draft" && (
              <button
                className="text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePublishSession(s._id, s.title)}
                disabled={publishingId === s._id}
              >
                {publishingId === s._id ? "Publishing..." : "Publish"}
              </button>
            )}
            <button
              className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleDeleteSession(s._id, s.title)}
              disabled={deletingId === s._id}
            >
              {deletingId === s._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MySessions;
