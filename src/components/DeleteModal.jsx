import React, { useState, useEffect } from "react";

export default function DeleteModal({ isOpen, onClose, onConfirm, song }) {
  const [visible, setVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // ✅ stanje za loading

  // Trigger visibility for fade-in
  useEffect(() => {
    if (isOpen) setVisible(true);
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 200);
  };

  const handleDelete = async () => {
    setIsDeleting(true); // ✅ započinjemo brisanje
    await onConfirm(song); // tvoj async zahtev ka bazi
    setIsDeleting(false); // ✅ završeno brisanje
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
        className={`bg-white rounded-lg p-6 max-w-md w-full shadow-lg transform transition-transform duration-200 ${
          visible ? "scale-100" : "scale-95"
        }`}
      >
        <h2 className="text-xl font-bold text-red-500 mb-4">Are you sure?</h2>
        <p className="mb-6 text-gray-700">
          This action cannot be undone. Delete "{song?.title}"?
        </p>
        <div className="flex justify-end gap-3">
          {/* Cancel button */}
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={handleClose}
            disabled={isDeleting} // disable cancel while deleting
          >
            Cancel
          </button>

          {/* Delete button */}
          <button
            className={`px-4 py-2 rounded text-white transition-all duration-200 shadow-sm hover:shadow-md ${
              isDeleting
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={handleDelete}
            disabled={isDeleting} // ✅ disable while deleting
          >
            {isDeleting ? "Deleting..." : "DELETE"} {/* ✅ loading indikator */}
          </button>
        </div>
      </div>
    </div>
  );
}
