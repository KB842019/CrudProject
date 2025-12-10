import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function AditiInterview() {
  const [posts, setPosts] = useState(new Array(10).fill(null));
  const [postCount, setPostCount] = useState(0);
  const [showList, setShowList] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts"));
    const savedCount = Number(localStorage.getItem("postCount"));

    if (Array.isArray(savedPosts)) {
      const filled = [...savedPosts];
      while (filled.length < 10) filled.push(null);
      setPosts(filled.slice(0, 10));
    } else {
      setPosts(new Array(10).fill(null));
    }

    setPostCount(Number.isFinite(savedCount) ? savedCount : 0);
  }, []);

  const saveToLocal = (updatedPosts, newCount) => {
    const toStore = updatedPosts.slice(0, 10);
    while (toStore.length < 10) toStore.push(null);

    localStorage.setItem("posts", JSON.stringify(toStore));
    localStorage.setItem("postCount", String(newCount));
  };

  const addPost = (data) => {
    const text = data.postText.trim();
    if (!text) return;

    const updatedPosts = posts.length === 10 ? [...posts] : [...posts, ...new Array(10 - posts.length).fill(null)];
    const index = postCount % 10;

    updatedPosts[index] = text;
    const newCount = (postCount + 1) % 10;

    setPosts(updatedPosts);
    setPostCount(newCount);
    saveToLocal(updatedPosts, newCount);

    reset(); 
  };

  const deleteOne = () => {
    if (posts.every((p) => !p)) return;

    const updatedPosts = [...posts];
    const index = (postCount - 1 + 10) % 10;

    if (!updatedPosts[index]) {
      let found = -1;
      for (let i = 9; i >= 0; i--) {
        if (updatedPosts[i]) {
          found = i;
          break;
        }
      }
      if (found === -1) return;
      updatedPosts[found] = null;
    } else {
      updatedPosts[index] = null;
    }

    setPosts(updatedPosts);
    saveToLocal(updatedPosts, postCount);
  };

  const deleteAll = () => {
    const empty = new Array(10).fill(null);
    setPosts(empty);
    setPostCount(0);
    localStorage.setItem("posts", JSON.stringify(empty));
    localStorage.setItem("postCount", "0");
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif", color: "#222" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>React Post App</h1>

      <form onSubmit={handleSubmit(addPost)}>
        <textarea
          {...register("postText", { required: "Post cannot be empty!" })}
          rows="4"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          placeholder="Write a post..."
        />
        {errors.postText && <p style={{ color: "red", marginTop: "5px" }}>{errors.postText.message}</p>}

        <button
          type="submit"
          style={{
            marginTop: "10px",
            background: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
            fontSize: "16px",
          }}
        >
          Add Post
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => setShowList(!showList)}
          style={{
            background: showList ? "#f44336" : "#2196F3",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {showList ? "Hide All" : "View All"}
        </button>

        <button
          onClick={deleteOne}
          style={{
            background: "#ff9800",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Delete One
        </button>

        <button
          onClick={deleteAll}
          style={{
            background: "#d32f2f",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Delete All
        </button>
      </div>

      {showList && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f9f9f9",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h2 style={{ marginBottom: "12px", color: "#444" }}>Stored Posts (Table View)</h2>

          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden" }}>
            <thead>
              <tr style={{ background: "#2196F3", color: "white" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Index</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Post Value</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p, i) => p && (
                <tr key={i}>
                  <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center", background: "#f5f5f5", width: "80px" }}>{i}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{p}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12, color: "#555", fontSize: 14 }}>
            Next write position: <b>{postCount % 10}</b>
          </div>
        </div>
      )}
    </div>
  );
}
