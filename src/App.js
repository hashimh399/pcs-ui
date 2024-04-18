// import logo from './logo.svg';
import "./App.css";
import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";

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

  const { sendMessage, data, isConnected } = useWebSocket();
  const [allData, setAlldata] = useState([]);

  // useEffect(() => {
  //   // Request SupervisorDetails and AllTimeReport when the component mounts
  //   if (isConnected) {
  //     const intervalId = setInterval(() => {
  //       sendMessage({
  //         data: { api: "SupervisorDetails" },
  //       });

  //       sendMessage({
  //         data: { api: "AllTimeReport" },
  //       });

  //       sendMessage({
  //         data: { api: "TeamWiseReport" },
  //       });
  //       sendMessage({
  //         data: { api: "AgentWiseReport" },
  //       });
  //       sendMessage({
  //         data: { api: "LiveSurvey" },
  //       });
  //       setAlldata(data);
  //     }, 10000);

  //     console.log("received data ", allData);
  //   } else {
  //     console.log("error fetching supervisor and allTimeReport");
  //   }

  //   // Optionally, listen for other real-time updates if your server supports it
  // }, [isConnected, allData]);

  // Access the data directly from the context state

  const getAllDetails = () => {
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
  };

  const { displayName } = data.SupervisorDetails ?? {};
  console.log("name is", displayName);
  console.log("is connected ", isConnected);

  return (
    <>
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
            <ChartCarousel allData={data} />
          </div>
          <div className="col">
            <AgentCarousel allData={data} />
          </div>
        </div>
      </div>

      <div className="container  ">
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
