import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./firebase-config"; // Firebase 설정을 포함합니다.

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
