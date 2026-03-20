import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ElectionProvider } from "./store/ElectionContext";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <ElectionProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0d1117",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: "13px",
            },
          }}
        />
        <App />
      </ElectionProvider>
    </BrowserRouter>
);
