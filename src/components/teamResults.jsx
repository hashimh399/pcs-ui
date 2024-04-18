import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../utils/pcs.css";
import { useWebSocket } from "../utils/websocket";

const CardComponent = ({ allData }) => {
  const { data } = useWebSocket();
  const [allTeamData, setAllTeamData] = useState([]);
  const [dateRange, setDateRange] = useState("allTime");
  const [supervisorDetails, setSupervisorDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTeamsDetails, setcurrentTeamsDetails] = useState(null);

  // Function to calculate the score
  const calculateScore = (data) => {
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
    if (data && data.TeamWiseReport && data.TeamWiseReport.length > 0) {
      setAllTeamData(data.TeamWiseReport[0]);
    }
  }, [data]);

  useEffect(() => {
    if (allData.SupervisorDetails && allData.SupervisorDetails.teamsData) {
      const supervisorTeams = allData.SupervisorDetails.teamsData;

      // Filter allTeamData based on dateRange
      const filteredAllTeamData = allTeamData.filter((teamData) => {
        const createdAtDate = new Date(teamData.createdAt);
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
          return true;
        }
      });

      const newData = supervisorTeams?.map((team) => {
        const teamData = filteredAllTeamData.find(
          (data) => data.teamId === team.id
        );
        const score = teamData ? calculateScore(teamData) : 0;
        return {
          name: team.name,
          score: parseFloat(score),
          details: teamData, // Adding team data details here
        };
      });

      setSupervisorDetails(newData);
    }
  }, [allData, allTeamData, dateRange]);

  useEffect(() => {
    setDateRange("allTime");
  }, [data]);

  // Handle changing the date range
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleShowModal = (details) => {
    setcurrentTeamsDetails(details);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="card agx">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Team Performance</h4>
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
          {supervisorDetails.map((team, index) => (
            <li key={index} className="agent-item">
              <p className="agent-name">{team.name}</p>

<<<<<<< HEAD
              <div className="d-flex flex-column mx-2">
                <p className="agent-score">Score: {team.score}</p>
                <a
                  className="agentReportlbl"
                  href="#!"
                  onClick={() => handleShowModal(team.details)}
                >
                  See full report
                </a>
              </div>
=======
              <a
                className="agentReportlbl"
                href="#!"
                onClick={() => handleShowModal(team.details)}
              >
                See full report
              </a>
              <p className="agent-score">Score: {team.score}</p>
>>>>>>> 787fcc09382ffc4860fad8e153248c547a60a9de
            </li>
          ))}
        </ul>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Team Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTeamsDetails ? (
            <div>
              <p>Team Name: {currentTeamsDetails?.teamName}</p>
              <p>
                Survey Response:{" "}
                {currentTeamsDetails?.Question1_No +
                  currentTeamsDetails?.Question1_Yes}
              </p>
              <p>Team score question Wise</p>
              <p>
                Q1 Score:{" "}
                {(
                  (currentTeamsDetails?.Question1_Yes /
                    (currentTeamsDetails?.Question1_Yes +
                      currentTeamsDetails?.Question1_No)) *
                  100
                ).toFixed(2)}
              </p>
              <p>
                Q2 Score:{" "}
                {(
                  (currentTeamsDetails?.Question2_Yes /
                    (currentTeamsDetails?.Question2_Yes +
                      currentTeamsDetails?.Question2_No)) *
                  100
                ).toFixed(2)}
              </p>
              <p>
                Q3 Score:{" "}
                {(
                  (currentTeamsDetails?.Question3_Yes /
                    (currentTeamsDetails?.Question3_Yes +
                      currentTeamsDetails?.Question3_No)) *
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
