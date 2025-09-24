import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(true);

  // Hide toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000); // start fade-out after 3s
    return () => clearTimeout(timer);
  }, []);

  // Remove toast after animation ends (0.3s)
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onClose, 300); // match slide-out duration
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  // Inject keyframes globally
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @keyframes slide-in {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      @keyframes slide-out {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  let bgColor;
  switch (type) {
    case "success":
      bgColor = "bg-emerald-500";
      break;
    case "error":
      bgColor = "bg-rose-500";
      break;
    case "info":
      bgColor = "bg-sky-500";
      break;
    default:
      bgColor = "bg-gray-500";
  }

  return (
    <div
      className={`px-6 py-3 text-white rounded shadow-lg ${bgColor}`}
      style={{
        animation: `${
          visible ? "slide-in" : "slide-out"
        } 0.3s ease-out forwards`,
      }}
    >
      {message}
    </div>
  );
}
