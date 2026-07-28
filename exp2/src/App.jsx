import { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem("drafts")) || [];
    setDrafts(savedDrafts);
  }, []);

  const saveDraft = () => {
    if (title.trim() === "" || content.trim() === "") {
      alert("Please enter both title and content.");
      return;
    }

    let updatedDrafts;

    if (selectedId) {
      updatedDrafts = drafts.map((draft) =>
        draft.id === selectedId
          ? {
              ...draft,
              title,
              content,
              updatedAt: new Date().toLocaleString(),
            }
          : draft
      );
      alert("Draft Updated!");
    } else {
      const newDraft = {
        id: Date.now(),
        title,
        content,
        updatedAt: new Date().toLocaleString(),
      };

      updatedDrafts = [...drafts, newDraft];
      alert("Draft Saved!");
    }

    setDrafts(updatedDrafts);
    localStorage.setItem("drafts", JSON.stringify(updatedDrafts));

    setTitle("");
    setContent("");
    setSelectedId(null);
  };

  const editDraft = (draft) => {
    setTitle(draft.title);
    setContent(draft.content);
    setSelectedId(draft.id);
  };

  const deleteDraft = (id) => {
    if (!window.confirm("Delete this draft?")) return;

    const updatedDrafts = drafts.filter((draft) => draft.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
  };

  const filteredDrafts = drafts.filter((draft) =>
    draft.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
        fontFamily: "Arial",
      }}
    >
      <h1>Draft Management System</h1>

      <input
        type="text"
        placeholder="Search drafts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <input
        type="text"
        placeholder="Enter Draft Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <textarea
        placeholder="Write your draft here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="8"
        style={{
          width: "100%",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <button onClick={saveDraft}>
        {selectedId ? "Update Draft" : "Save Draft"}
      </button>

      <h2>Saved Drafts ({filteredDrafts.length})</h2>

      {filteredDrafts.length === 0 ? (
        <p>No drafts found.</p>
      ) : (
        filteredDrafts.map((draft) => (
          <div
            key={draft.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{draft.title}</h3>

            <p>{draft.content}</p>

            <small>Last Updated: {draft.updatedAt}</small>

            <br />
            <br />

            <button onClick={() => editDraft(draft)}>Edit</button>

            <button
              onClick={() => deleteDraft(draft.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;