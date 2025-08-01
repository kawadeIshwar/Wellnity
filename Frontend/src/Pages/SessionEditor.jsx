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

  // 🔄 Load session when ID exists and not 'new'
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

  // ⏳ Auto-save after 5s of no input
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

  // 📝 Save Draft/New
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

  // 🚀 Publish
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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Session Editor (Auto-Save)</h1>

      <input
        placeholder="Title"
        className="block border p-2 mb-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Tags (comma-separated)"
        className="block border p-2 mb-2 w-full"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <input
        placeholder="JSON File URL"
        className="block border p-2 mb-4 w-full"
        value={jsonURL}
        onChange={(e) => setJsonURL(e.target.value)}
      />

      <button
        onClick={() => handleSave()}
        className="bg-gray-600 text-white px-4 py-2 mr-3 rounded"
      >
        Save Draft
      </button>

      <button
        onClick={handlePublish}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Publish
      </button>
    </div>
  );
}

export default SessionEditor;
