import React, { useState, useEffect } from "react";

export default function Modal({ isOpen, onClose, song }) {
  const [visible, setVisible] = useState(false);

  // Trigger visibility for fade-in
  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  // Handle close with animation
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 200); // duration matches Tailwind transition
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

        <h2 className="text-2xl font-bold text-pink-500 mb-4">{song.title}</h2>
        <p className="text-gray-700 whitespace-pre-wrap mb-4">{song.content}</p>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>By {song.author}</span>
          <span>{new Date(song.created_at).toLocaleDateString("en-US")}</span>
        </div>
      </div>
    </div>
  );
}
