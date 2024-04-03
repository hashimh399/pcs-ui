import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Dashboard from "./pages/dashboard";
import { BrowserRouter } from "react-router-dom";
import OAuthLogin from "./pages/auth";
import Navbar from "./components/header";
import AgentScoresCard from "./components/agentResults";
import TeamScoresCard from "./components/teamResults";
import "bootstrap/dist/css/bootstrap.min.css";
import { WebSocketProvider } from "./utils/websocket";

const root = ReactDOM.createRoot(document.getElementById("root"));
// const websocket = initws("Hello");
root.render(
  <WebSocketProvider>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </WebSocketProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
