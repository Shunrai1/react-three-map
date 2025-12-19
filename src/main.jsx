import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import "normalize.css";
import "./index.scss";
// import "@/styles/tailwind.css";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
