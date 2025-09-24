import React, { useState, useEffect } from "react";

export default function EditSongModal({ isOpen, onClose, onEditSong, song }) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // <-- promenjeno sa text

  // When modal opens or song changes, pre-fill form
  useEffect(() => {
    if (isOpen && song) {
      setTitle(song.title);
      setContent(song.content); // <-- promenjeno sa text
      setVisible(true);
    }
  }, [isOpen, song]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      setTitle("");
      setContent(""); // <-- promenjeno sa text
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const updatedFields = { title, content };
    onEditSong(song.id, updatedFields); // <-- ovo je bitno

    handleClose();
  };

  if (!isOpen && !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-lg p-6 max-w-lg w-full max-h-full overflow-y-auto shadow-lg transform transition-transform duration-200 ${
          visible ? "scale-100" : "scale-95"
        }`}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          onClick={handleClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-pink-500 mb-4">Edit Song</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <textarea
            placeholder="Content"
            value={content} // <-- promenjeno sa text
            onChange={(e) => setContent(e.target.value)} // <-- promenjeno sa text
            rows={5}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
          />

          <button
            type="submit"
            className="bg-pink-400 text-white py-3 rounded hover:bg-pink-500 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
