import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("main.tsx: Script loaded");

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("main.tsx: 'root' element not found in the DOM");
  } else {
    console.log("main.tsx: 'root' element found, rendering App...");
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("main.tsx: App rendered to 'root'");
  }
} catch (error) {
  console.error("main.tsx: Error rendering App:", error);
}
