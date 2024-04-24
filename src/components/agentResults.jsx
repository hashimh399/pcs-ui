import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../utils/pcs.css";

import ExcelDownloadButton from "./ExcelSheetDownload";
import DownloadButton from "./jsonDataDownload";

const CardComponent = ({ allData }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentLiveSurvey, setCurrentLiveSurvey] = useState();

  const [currentAgentDetails, setCurrentAgentDetails] = useState();
  const [agentExcel, setAgentExcel] = useState([]);
  const [agentWiseExcel, setAgentWiseExcel] = useState();
  const [dateRange, setDateRange] = useState("allTime");
  const [agentData, setAgentData] = useState([]);
  const [totalLiveSurvey, setTotalLiveSurvey] = useState([]);
  const [allAgentData, setAllAgentData] = useState([]);

  // Function to calculate the score
  const calculateScore = (data) => {
    const score =
      ((data.Question1_Yes + data.Question2_Yes + data.Question3_Yes) /
        (data.Question1_Yes +
          data.Question1_No +
          data.Question2_Yes +
          data.Question2_No +
          data.Question3_Yes +
          data.Question3_No)) *
      100;
    return isNaN(score) ? 0 : score.toFixed(2);
  };

  useEffect(() => {
    if (
      allData &&
      allData.AgentWiseReport &&
      allData.AgentWiseReport.length > 0
    ) {
      setAllAgentData(allData.AgentWiseReport[0]);
    }
    if (allData?.SupervisorDetails && allData?.SupervisorDetails?.teamsData) {
      const teamsData = allData?.SupervisorDetails?.teamsData;
      if (allData && allData.LiveSurvey && allData.LiveSurvey.length > 0) {
        setTotalLiveSurvey(allData.LiveSurvey[0]);
      }
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

      // filter live survey data
      const filteredLiveSurvey = totalLiveSurvey.filter((liveSurey) => {
        const createdAtDate = new Date(liveSurey.createdAt);
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
      filteredLiveSurvey.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA - dateB;
      });
      console.log("filtered live survey data is :", filteredLiveSurvey);

      // making of new data set from filtered live survey data
      const newLiveSuveyData = filteredLiveSurvey.map((liveSurey) => {
        const date = new Date(liveSurey.createdAt);
        return {
          ID: liveSurey.agentId,
          AgentName: liveSurey.agentName,
          ANI: liveSurey.aniNumber,
          Date_Time: date.toLocaleString(),
          Q1: liveSurey.question1,
          Q2: liveSurey.question2,
          Q3: liveSurey.question3,
        };
      });

      setAgentExcel(newLiveSuveyData);
      //sortign of data according to the date and time

      const newData = uniqueAgents.map((agent) => {
        const AgentData = filteredAllAgentData.find(
          (data) => data.agentId === agent.id
        );

        const score = AgentData ? calculateScore(AgentData) : 0;
        const filteredAgentLiveSurvey = filteredLiveSurvey.filter(
          (liveSurey) => liveSurey.agentId === agent.id
        );

        return {
          name: agent.name,
          score: parseFloat(score),
          details: AgentData,
          liveSurvey: filteredAgentLiveSurvey,
        };
      });

      setAgentData(newData);
    }
  }, [allData, allAgentData, dateRange, totalLiveSurvey]);

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };
  const handleShowModal = (details, liveSurvey) => {
    setCurrentAgentDetails(details);
    setCurrentLiveSurvey(liveSurvey);

    //setting current agent detais for excel sheet
    setAgentWiseExcel({
      AgentName: details.agentName,
      Survey_Response: details.Question1_Yes + details.Question1_No,
      liveSurvey: liveSurvey.map((survey) => ({
        ANI: survey.aniNumber,
        Q1: survey.question1,
        Q2: survey.question2,
        Q3: survey.question3,
      })),

      Q1_Score: (
        (details?.Question1_Yes /
          (details?.Question1_Yes + details?.Question1_No)) *
        100
      ).toFixed(2),
      Q2_Score: (
        (details?.Question2_Yes /
          (details?.Question2_Yes + details?.Question2_No)) *
        100
      ).toFixed(2),
      Q3_Score: (
        (details?.Question3_Yes /
          (details?.Question3_Yes + details?.Question3_No)) *
        100
      ).toFixed(2),
    });

    console.log("agent wise excel", agentWiseExcel);

    console.log("current live survey data", currentLiveSurvey);
    setShowModal(true);
  };

  console.log("agent data is :", agentData);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="card agx">
      {/* <button onClick={handleSendMessage}>Refresh</button> */}
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Agent Performance</h4>
          <ExcelDownloadButton
            data={agentExcel}
            fileName={dateRange + " agentReport " + Date()}
          />
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

              <div className="d-flex flex-column mx-2">
                <p className="agent-score">Score: {agent.score}</p>
                {/* {console.log("agent current", agent.liveSurvey)} */}
                <Button
                  className="agentReportlbl"
                  variant="success"
                  onClick={() =>
                    handleShowModal(agent.details, agent.liveSurvey)
                  }
                >
                  See full report
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agent Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentAgentDetails ? (
            <div>
              <p>Agent Name: {currentAgentDetails?.agentName}</p>
              <p>
                Survey Response:{" "}
                {currentAgentDetails?.Question1_No +
                  currentAgentDetails?.Question1_Yes}
              </p>
              <div className="tableDiv">
                <table className="agent-table">
                  <thead>
                    <tr>
                      <th>Ani</th>
                      <th>Date Time</th>
                      <th>Q1</th>
                      <th>Q2</th>
                      <th>Q3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log("current survey", currentLiveSurvey)}
                    {currentLiveSurvey?.map((survey, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "even-row" : "odd-row"}
                      >
                        <td>{survey.aniNumber}</td>
                        <td>{new Date(survey.createdAt).toLocaleString()}</td>
                        <td>{survey.question1}</td>
                        <td>{survey.question2}</td>
                        <td>{survey.question3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>Agent score question Wise</p>
              <p>
                Q1 Score:{" "}
                {currentAgentDetails?.Question1_No +
                  currentAgentDetails?.Question1_Yes >
                0
                  ? (
                      (currentAgentDetails?.Question1_Yes /
                        (currentAgentDetails?.Question1_Yes +
                          currentAgentDetails?.Question1_No)) *
                      100
                    ).toFixed(2)
                  : 0}
              </p>
              <p>
                Q2 Score:{" "}
                {currentAgentDetails?.Question1_No +
                  currentAgentDetails?.Question1_Yes >
                0
                  ? (
                      (currentAgentDetails?.Question2_Yes /
                        (currentAgentDetails?.Question2_Yes +
                          currentAgentDetails?.Question2_No)) *
                      100
                    ).toFixed(2)
                  : 0}
              </p>
              <p>
                Q3 Score:{" "}
                {currentAgentDetails?.Question1_No +
                  currentAgentDetails?.Question1_Yes >
                0
                  ? (
                      (currentAgentDetails?.Question3_Yes /
                        (currentAgentDetails?.Question3_Yes +
                          currentAgentDetails?.Question3_No)) *
                      100
                    ).toFixed(2)
                  : 0}
              </p>
            </div>
          ) : (
            <p>No data found</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* <DownloadButton
            data={agentWiseExcel}
            fileName="agentwise"
          ></DownloadButton> */}
          {/* <ExcelDownloadButton data={agentData} fileName="example" /> */}

          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CardComponent;
