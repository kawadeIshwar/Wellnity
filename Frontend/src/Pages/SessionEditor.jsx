import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function SessionEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [jsonURL, setJsonURL] = useState("");

  // Debug: Check token status
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Current token status:", {
      exists: !!token,
      length: token?.length,
      preview: token?.substring(0, 50) + "..."
    });
  }, []);

  const timerRef = useRef(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!id) {
      alert("No session ID provided");
      navigate("/my-sessions");
      return;
    }

    if (id === "new") {
      setTitle("");
      setTags("");
      setJsonURL("");
      return;
    }

    axios.get(`/my-sessions/${id}`)
      .then((res) => {
        setTitle(res.data.title || "");
        setTags(res.data.tags?.join(", ") || "");
        setJsonURL(res.data.json_file_url || "");
      })
      .catch((err) => {
        console.error("Error loading session:", err);
        if (err.response?.status === 401) navigate("/");
        else navigate("/my-sessions");
      });
  }, [id, navigate]);

  // Auto-save functionality removed
  // useEffect(() => {
  //   if (isFirstLoad.current) {
  //     isFirstLoad.current = false;
  //     return;
  //   }

  //   if (timerRef.current) clearTimeout(timerRef.current);

  //   timerRef.current = setTimeout(() => {
  //     handleSave(true);
  //   }, 5000);

  //   return () => clearTimeout(timerRef.current);
  // }, [title, tags, jsonURL]);

  const handleSave = async (isAuto = false) => {
    try {
      if (id === "new") {
        console.log("Creating new session with data:", { title, tags, jsonURL });
        const res = await axios.post("/my-sessions/create", {
          title,
          tags: tags.split(",").map((t) => t.trim()),
          json_file_url: jsonURL,
        });
        console.log("Session creation response:", res.data);
        if (res.data && res.data._id) {
          navigate(`/edit/${res.data._id}`);
        }
        if (!isAuto) alert("Session created!");
      } else {
        console.log("Saving draft for session:", id);
        await axios.post("/my-sessions/save-draft", {
          sessionId: id,
          title,
          tags: tags.split(",").map((t) => t.trim()),
          json_file_url: jsonURL,
        });
        if (!isAuto) alert("Draft saved!");
      }
    } catch (err) {
      console.error("Error saving session:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        isAuto
      });
      if (!isAuto) alert(`Error saving draft: ${err.response?.data?.msg || err.message}`);
    }
  };

  const handlePublish = async () => {
    try {
      let publishId = id;

      if (id === "new") {
        console.log("Creating new session for publishing with data:", { title, tags, jsonURL });
        const res = await axios.post("/my-sessions/create", {
          title,
          tags: tags.split(",").map((t) => t.trim()),
          json_file_url: jsonURL,
        });
        console.log("Session creation response for publish:", res.data);
        if (res.data && res.data._id) {
          publishId = res.data._id;
          navigate(`/edit/${publishId}`);
        } else {
          console.error("No _id in response:", res.data);
          alert("Could not create session for publishing");
          return;
        }
      } else {
        console.log("Saving draft before publishing for session:", id);
        await handleSave();
      }

      console.log("Publishing session with ID:", publishId);
      await axios.post("/my-sessions/publish", { sessionId: publishId });
      alert("Session published!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error publishing session:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      alert(`Error publishing session: ${err.response?.data?.msg || err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center py-10 px-4 font-poppins">
      <div className="w-full max-w-2xl bg-slate-900 shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">
          Session Editor
        </h1>

        <input
          placeholder="Title"
          className="block border-2 text-gray-900 p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Tags (comma-separated)"
          className="block border border-gray-300 p-3 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <input
          placeholder="JSON File URL"
          className="block border border-gray-300 p-3 mb-6 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={jsonURL}
          onChange={(e) => setJsonURL(e.target.value)}
        />

        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleSave()}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Save Draft
          </button>

          <button
            onClick={handlePublish}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionEditor;