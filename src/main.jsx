import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AppProvider } from "./Context/Context";
import { AuthProvider } from "./Context/AuthContext";
import { BrowserRouter } from "react-router-dom"; // Add this back

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* Router MUST wrap all providers */}
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>{" "}
    {/* Router MUST wrap all providers */}
  </React.StrictMode>,
);
