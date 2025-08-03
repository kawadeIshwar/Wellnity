import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast("No session ID provided");
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
        if (!isAuto) toast.success("Session created!");
      } else {
        console.log("Saving draft for session:", id);
        await axios.post("/my-sessions/save-draft", {
          sessionId: id,
          title,
          tags: tags.split(",").map((t) => t.trim()),
          json_file_url: jsonURL,
        });
        if (!isAuto) toast.success("Draft saved!");
      }
    } catch (err) {
      console.error("Error saving session:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        isAuto
      });
      if (!isAuto) toast.error(`Error saving draft: ${err.response?.data?.msg || err.message}`);
    }
  };

  const handlePublish = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to publish a session!");
      navigate("/login");
      return;
    }

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
          toast.error("Could not create session for publishing");
          return;
        }
      } else {
        console.log("Saving draft before publishing for session:", id);
        await handleSave();
      }

      console.log("Publishing session with ID:", publishId);
      await axios.post("/my-sessions/publish", { sessionId: publishId });
      toast.success("Session published!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error publishing session:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      toast.error(`Error publishing session: ${err.response?.data?.msg || err.message}`);
    }
  };

 return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl">
        <h1
          className="text-3xl font-bold mb-6 text-center text-purple-800"
        >
          Session Editor
        </h1>

        <input
          placeholder="Title"
          className="w-full mb-4 text-purple-800 font-semibold px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2  focus:ring-purple-400 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Tags (comma-separated)"
          className="w-full mb-4 text-purple-800 font-semibold px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <input
          placeholder="JSON File URL"
          className="w-full mb-6 text-purple-800 font-semibold px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          value={jsonURL}
          onChange={(e) => setJsonURL(e.target.value)}
        />

        <div className="flex justify-between gap-4">
          <button
            onClick={handleSave}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md text-sm font-medium transition"
          >
            Save Draft
          </button>

          <button
            onClick={handlePublish}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium transition"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionEditor;