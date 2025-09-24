import { useState, useEffect } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai"; // Arrow icon

export default function LoginPage({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(true); // animacija

  // Inject global keyframes
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    onLogin?.(username, password);
  };

  const handleBack = () => {
    setVisible(false); // pokreće slide-out
    setTimeout(() => {
      onBack?.();
    }, 300); // trajanje animacije
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 p-4 relative"
      style={{
        animation: `${
          visible ? "slide-in" : "slide-out"
        } 0.3s ease-out forwards`,
      }}
    >
      {/* Back to Home */}
      <button
        className="absolute top-4 left-4 flex items-center gap-1 text-pink-700 hover:text-pink-900 font-medium z-10"
        onClick={handleBack}
      >
        <AiOutlineArrowLeft size={20} /> Back to Home
      </button>

      <div className="w-full max-w-sm bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-6 z-0">
        <h1 className="text-2xl font-bold text-center text-pink-500 mb-6">
          Admin Panel
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pink-700">
              Username
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-pink-300 px-4 py-2 text-pink-800 focus:border-pink-500 focus:ring focus:ring-pink-300 outline-none"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-pink-300 px-4 py-2 text-pink-800 focus:border-pink-500 focus:ring focus:ring-pink-300 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
