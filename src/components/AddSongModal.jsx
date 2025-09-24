import React, { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";

export default function AddSongModal({
  isOpen,
  onClose,
  onAddSong,
  adminName,
}) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      setTitle("");
      setContent("");
      setLoading(false);
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("songs")
      .insert([{ title, content, author: adminName }])
      .select();

    if (error) {
      console.error(error);
      alert("Failed to add song!");
      setLoading(false);
    } else {
      if (onAddSong) onAddSong(data[0]); // odmah dodaj u App.jsx
      handleClose();
    }
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

        <h2 className="text-2xl font-bold text-pink-500 mb-4">Add New Song</h2>

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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
          />

          <button
            type="submit"
            className="bg-pink-400 text-white py-3 rounded hover:bg-pink-500 transition"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Song"}
          </button>
        </form>
      </div>
    </div>
  );
}
