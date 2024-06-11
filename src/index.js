// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css"; // 추가
import "./firebase-config";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
