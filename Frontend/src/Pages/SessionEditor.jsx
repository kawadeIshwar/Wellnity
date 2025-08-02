import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function SessionEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [jsonURL, setJsonURL] = useState("");

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

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      handleSave(true);
    }, 5000);

    return () => clearTimeout(timerRef.current);
  }, [title, tags, jsonURL]);

  const handleSave = async (isAuto = false) => {
    try {
      if (id === "new") {
        const res = await axios.post("/my-sessions/create", {
          title,
          tags: tags.split(",").map((t) => t.trim()),
          json_file_url: jsonURL,
        });
        if (res.data && res.data.id) {
          navigate(`/edit/${res.data.id}`);
        }
        if (!isAuto) alert("Session created!");
      } else {
        await axios.post("/my-sessions/save-draft", {
          sessionId: id,
          title,
          tags: tags.split(",").map((t) => t.trim()),
          json_file_url: jsonURL,
        });
        if (!isAuto) alert("Draft saved!");
      }
    } catch (err) {
      if (!isAuto) alert("Error saving draft");
    }
  };

  const handlePublish = async () => {
    try {
      let publishId = id;

      if (id === "new") {
        const res = await axios.post("/my-sessions/create", {
          title,
          tags: tags.split(",").map((t) => t.trim()),
          json_file_url: jsonURL,
        });
        if (res.data && res.data.id) {
          publishId = res.data.id;
          navigate(`/edit/${publishId}`);
        } else {
          alert("Could not create session for publishing");
          return;
        }
      } else {
        await handleSave();
      }

      await axios.post("/my-sessions/publish", { sessionId: publishId });
      alert("Session published!");
      navigate("/dashboard");
    } catch (err) {
      alert("Error publishing session");
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center py-10 px-4 font-poppins">
      <div className="w-full max-w-2xl bg-slate-900 shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">
          Session Editor (Auto-Save)
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
