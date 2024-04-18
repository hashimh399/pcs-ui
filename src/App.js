// import logo from './logo.svg';
import "./App.css";
import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Surveys from "./pages/surveyList";
import Create from "./pages/createSurvey";
import Layout from "./pages/Layout";
import OAuthCallback from "./pages/callback";
import Navbar from "./components/header";
import AgentScoresCard from "./components/agentResults";
import TeamScoresCard from "./components/teamResults";
import ChartCarousel from "./components/teamChart";
import AgentCarousel from "./components/agentChart";
import FeedbackCarousel from "./components/feedbackChart";
import "bootstrap/dist/css/bootstrap.min.css";
import { useWebSocket } from "./utils/websocket";

// eslint-disable-next-line no-unused-vars
function surveyScore(responses) {
  const validResponses = responses.filter((response) => response !== null);
  const yesCount = validResponses.reduce(
    (acc, response) => acc + (response === "Yes" ? 1 : 0),
    0
  );
  const avgScore =
    validResponses.length > 0 ? (yesCount / validResponses.length) * 100 : 0;
  console.log(validResponses, yesCount, avgScore);
  return avgScore;
}

function App() {
  //const [data, setData] = useState(null);
  const [supervisorName, setSupervisorName] = useState("");
  const [q1, setq1] = useState([]);
  const [q2, setq2] = useState([]);
  const [q3, setq3] = useState([]);

  const { sendMessage, data } = useWebSocket();

  useEffect(() => {
    // Request SupervisorDetails and AllTimeReport when the component mounts
    sendMessage({
      data: { api: "SupervisorDetails" },
    });
    sendMessage({
      data: { api: "AllTimeReport" },
    });

    // Optionally, listen for other real-time updates if your server supports it
  }, [sendMessage]);

  // Access the data directly from the context state
  const supervisorDetails = data.SupervisorDetails;
  const { displayName } = data.SupervisorDetails ?? {};
  console.log("name is", displayName);
  console.log("is connected ", isConnected);

  return (
    <>
      <button
        onClick={() => {
          sendMessage({
            data: { api: "SupervisorDetails" },
          });

          sendMessage({
            data: { api: "AllTimeReport" },
          });

          sendMessage({
            data: { api: "TeamWiseReport" },
          });
          sendMessage({
            data: { api: "AgentWiseReport" },
          });
          sendMessage({
            data: { api: "LiveSurvey" },
          });
          setAlldata(data);
          console.log("received data ", allData);
        }}
      >
        Refresh
      </button>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>

      <Navbar name={displayName} button={getAllDetails} />

      <div className="container">
        <div className="row">
          <div className="col"></div>

          <FeedbackCarousel allData={allData} />
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col">
            <ChartCarousel alldata={data} />
          </div>
          <div className="col">
            <FeedbackCarousel q1={q1} q2={q2} q3={q3} />
          </div>
        </div>
      </div>

      <div className="container text-center">
        <div className="row">
          <div className="col">
            <AgentScoresCard className="agentScoreCard" allData={allData} />
          </div>
          <div className="col">
            <TeamScoresCard allData={allData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
