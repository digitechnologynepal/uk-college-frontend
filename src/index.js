import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PreloaderContextProvider from "./context/PreloaderContext";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PreloaderContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </PreloaderContextProvider>
);
