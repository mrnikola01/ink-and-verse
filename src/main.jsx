import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css"; // <-- use global.css with Tailwind
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
