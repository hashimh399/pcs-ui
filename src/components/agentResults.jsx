import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../utils/pcs.css";
import { useWebSocket } from "../utils/websocket";

const CardComponent = ({ allData }) => {
  const { data } = useWebSocket();

  const [showModal, setShowModal] = useState(false);

  const [currentAgentDetails, setCurrentAgentDetails] = useState("");

  const [dateRange, setDateRange] = useState("allTime");
  const [agentData, setAgentData] = useState([]);

  const [allAgentData, setAllAgentData] = useState([]);

  // Function to calculate the score
  const calculateScore = (data) => {
    console.log("hello from agetn result");
    return (
      ((data.Question1_Yes + data.Question2_Yes + data.Question3_Yes) /
        (data.Question1_Yes +
          data.Question1_No +
          data.Question2_Yes +
          data.Question2_No +
          data.Question3_Yes +
          data.Question3_No)) *
      100
    ).toFixed(2);
  };

  useEffect(() => {
    if (data && data.AgentWiseReport && data.AgentWiseReport.length > 0) {
      setAllAgentData(data.AgentWiseReport[0]);
    }
  }, [data]);

  useEffect(() => {
    if (allData?.SupervisorDetails && allData?.SupervisorDetails?.teamsData) {
      const teamsData = allData?.SupervisorDetails?.teamsData;

      // Extract unique agents from all teams
      const uniqueAgents = Array.from(
        new Map(
          teamsData
            .flatMap((team) =>
              team.users.map((user) => ({
                id: user.ciUserId,
                name: user.firstName + " " + user.lastName,
              }))
            )
            .map((user) => [user.id, user])
        ).values()
      );

      console.log("unique teamsData are: ");

      // Filter allAgentData based on dateRange
      const filteredAllAgentData = allAgentData.filter((AgentData) => {
        const createdAtDate = new Date(AgentData.createdAt);
        const today = new Date();
        const sevenDaysAgo = new Date(
          today.getTime() - 7 * 24 * 60 * 60 * 1000
        );

        if (dateRange === "today") {
          return (
            createdAtDate.getDate() === today.getDate() &&
            createdAtDate.getMonth() === today.getMonth() &&
            createdAtDate.getFullYear() === today.getFullYear()
          );
        } else if (dateRange === "last7Days") {
          return createdAtDate >= sevenDaysAgo && createdAtDate <= today;
        } else {
          return true; // Show all data for "allTime"
        }
      });
      //   console.log("filteredAllAgentData ", filteredAllAgentData);
      const newData = uniqueAgents.map((agent) => {
        const AgentData = filteredAllAgentData.find(
          (data) => data.agentId === agent.id
        );
        const score = AgentData ? calculateScore(AgentData) : 0;

        return {
          name: agent.name,
          score: parseFloat(score),
          details: AgentData,
        };
      });

      setAgentData(newData);
    }
  }, [allData, allAgentData, dateRange]);

  useEffect(() => {
    // Set default date range to "allTime" when component mounts
    setDateRange("allTime");
  }, [data]);

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };
  const handleShowModal = (details) => {
    setCurrentAgentDetails(details);
    setShowModal(true);
  };

  // function to send message to websocket
  console.log("agent data is :", agentData);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="card agx">
      {/* <button onClick={handleSendMessage}>Refresh</button> */}
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Agent Performance</h4>
          <select
            className="form-select-sm"
            onChange={handleDateRangeChange}
            value={dateRange}
          >
            <option value="allTime">All Time</option>
            <option value="today">Today</option>
            <option value="last7Days">Last 7 Days</option>
          </select>
        </div>

        <ul className="agent-list">
          {agentData.map((agent, index) => (
            <li key={index} className="agent-item">
              <p className="agent-name">{agent.name}</p>

              <a
                className="agentReportlbl"
                href="#!"
                onClick={() => handleShowModal(agent.details)}
              >
                See full report
              </a>
              <p className="agent-score">Score: {agent.score}</p>
            </li>
          ))}
        </ul>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agent Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {console.log("currentAgentDetails ", currentAgentDetails)}
          {currentAgentDetails ? (
            <div>
              <p>Agent Name: {currentAgentDetails?.agentName}</p>
              <p>
                Survey Response:{" "}
                {currentAgentDetails?.Question1_No +
                  currentAgentDetails?.Question1_Yes}
              </p>
              <p>Agent score question Wise</p>
              <p>
                Q1 Score:{" "}
                {(
                  (currentAgentDetails?.Question1_Yes /
                    (currentAgentDetails?.Question1_Yes +
                      currentAgentDetails?.Question1_No)) *
                  100
                ).toFixed(2)}
              </p>
              <p>
                Q2 Score:{" "}
                {(
                  (currentAgentDetails?.Question2_Yes /
                    (currentAgentDetails?.Question2_Yes +
                      currentAgentDetails?.Question2_No)) *
                  100
                ).toFixed(2)}
              </p>
              <p>
                Q3 Score:{" "}
                {(
                  (currentAgentDetails?.Question3_Yes /
                    (currentAgentDetails?.Question3_Yes +
                      currentAgentDetails?.Question3_No)) *
                  100
                ).toFixed(2)}
              </p>
            </div>
          ) : (
            <p>No data found</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Download csv file</Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CardComponent;
