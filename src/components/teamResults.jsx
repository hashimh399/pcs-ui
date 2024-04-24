import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../utils/pcs.css";
import { useWebSocket } from "../utils/websocket";
import ExcelDownloadButton from "./ExcelSheetDownload";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const CardComponent = ({ allData }) => {
  const { data } = useWebSocket();
  const [allTeamData, setAllTeamData] = useState([]);
  const [dateRange, setDateRange] = useState("allTime");
  const [supervisorDetails, setSupervisorDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTeamData, setCurrentTeamData] = useState([]);

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
      // setting the supervisor teams data
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
        console.log("team data is ", teamData);

        const score = teamData ? calculateScore(teamData) : 0;
        return {
          name: team.name,
          score: parseFloat(score),
          details: teamData,
          liveSurvey: allData.LiveSurvey,
        };
      });
      setSupervisorDetails(newData);
      console.log("SUPERVISOR DETAILS ", supervisorDetails);
    }
  }, [allData, allTeamData, dateRange]);

  useEffect(() => {
    setDateRange("allTime");
  }, [data]);

  // Handle changing the date range
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleShowModal = (details, liveSurvey) => {
    setcurrentTeamsDetails(details);

    // set current team data and filter the survey according to the team
    const currentTeamId = details?.teamId;
    const currentData = liveSurvey[0]?.filter((survey) => {
      // console.log("Survey Team ID:", survey.teamId);
      return survey?.teamId === currentTeamId;
    });
    setCurrentTeamData(currentData);
    console.log("current team id is  ", currentTeamId);
    console.log("current team data  ", currentData);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="card agx">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Team Performance</h4>
          <ExcelDownloadButton
            data={supervisorDetails}
            fileName={dateRange + " agentReport"}
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
          {supervisorDetails.map((team, index) => (
            <li key={index} className="agent-item">
              <p className="agent-name">{team.name}</p>

              <div className="d-flex flex-column mx-2">
                <p className="agent-score">Score: {team.score}</p>
                <Button
                  variant="success"
                  className="agentReportlbl"
                  onClick={() => handleShowModal(team.details, team.liveSurvey)}
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
          <Modal.Title>Team Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTeamsDetails ? (
            <div>
              <p>Team Name: {currentTeamsDetails?.teamName}</p>
              <div className=" d-flex justify-center justify-content-around  ">
                <a
                  href="#!"
                  data-tooltip-id="Q1"
                  data-tooltip-content={
                    currentTeamsDetails?.Question1_No +
                      currentTeamsDetails?.Question1_Yes >
                    0
                      ? (
                          (currentTeamsDetails?.Question1_Yes /
                            (currentTeamsDetails?.Question1_Yes +
                              currentTeamsDetails?.Question1_No)) *
                          100
                        ).toFixed(2)
                      : 0
                  }
                >
                  <Button variant="info">Q1 Score</Button>
                </a>
                <Tooltip id="Q1"></Tooltip>

                {/* button 2 */}
                <a
                  href="#!"
                  data-tooltip-id="Q2"
                  data-tooltip-content={
                    currentTeamsDetails?.Question2_No +
                      currentTeamsDetails?.Question2_Yes >
                    0
                      ? (
                          (currentTeamsDetails?.Question2_Yes /
                            (currentTeamsDetails?.Question2_Yes +
                              currentTeamsDetails?.Question2_No)) *
                          100
                        ).toFixed(2)
                      : 0
                  }
                >
                  <Button variant="info">Q2 Score</Button>
                </a>
                <Tooltip id="Q2"></Tooltip>

                {/* button 3 for Q3 score */}
                <a
                  href="#!"
                  data-tooltip-id="Q3"
                  data-tooltip-content={
                    currentTeamsDetails?.Question3_No +
                      currentTeamsDetails?.Question3_Yes >
                    0
                      ? (
                          (currentTeamsDetails?.Question3_Yes /
                            (currentTeamsDetails?.Question3_Yes +
                              currentTeamsDetails?.Question3_No)) *
                          100
                        ).toFixed(2)
                      : 0
                  }
                >
                  <Button variant="info">Q3 Score</Button>
                </a>
                <Tooltip id="Q3"></Tooltip>
              </div>
              <p>
                Survey Response:{" "}
                {currentTeamsDetails?.Question1_No +
                  currentTeamsDetails?.Question1_Yes}
              </p>

              <div className="tableDiv">
                <table className="agent-table">
                  <thead>
                    <tr>
                      <th>Agent Name</th>
                      <th>Ani</th>

                      <th>Date Time</th>
                      <th>Q1</th>
                      <th>Q2</th>
                      <th>Q3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTeamData?.map((survey, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "even-row" : "odd-row"}
                      >
                        <td>{survey.agentName}</td>
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
            </div>
          ) : (
            <p>No data found</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CardComponent;

// *****************************************************************************************************

// import React, { useEffect, useState } from "react";
// import { Modal, Button } from "react-bootstrap";
// import "../utils/pcs.css";
// import { useWebSocket } from "../utils/websocket";
// import ExcelDownloadButton from "./ExcelSheetDownload";
// import "react-tooltip/dist/react-tooltip.css";
// import { Tooltip } from "react-tooltip";

// const CardComponent = ({ allData }) => {
//   const { data } = useWebSocket();
//   const [allTeamData, setAllTeamData] = useState([]);
//   const [dateRange, setDateRange] = useState("allTime");
//   const [supervisorDetails, setSupervisorDetails] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentTeamData, setCurrentTeamData] = useState([]);
//   const [currentTeamsDetails, setcurrentTeamsDetails] = useState(null);

//   const calculateScore = (data) => {
//     return (
//       ((data.Question1_Yes + data.Question2_Yes + data.Question3_Yes) /
//         (data.Question1_Yes +
//           data.Question1_No +
//           data.Question2_Yes +
//           data.Question2_No +
//           data.Question3_Yes +
//           data.Question3_No)) *
//       100
//     ).toFixed(2);
//   };

//   useEffect(() => {
//     if (data && data.TeamWiseReport && data.TeamWiseReport.length > 0) {
//       setAllTeamData(data.TeamWiseReport[0]);
//     }
//   }, [data]);

//   useEffect(() => {
//     if (
//       allData.SupervisorDetails &&
//       allData.SupervisorDetails.teamsData &&
//       allTeamData.length > 0
//     ) {
//       const supervisorTeams = allData.SupervisorDetails.teamsData;

//       const filteredSupervisorTeams = supervisorTeams.filter((team) =>
//         allTeamData.find((data) => data.teamId === team.id)
//       );

//       setSupervisorDetails(filteredSupervisorTeams);
//     }
//   }, [allData, allTeamData]);

//   useEffect(() => {
//     setDateRange("allTime");
//   }, [data]);

//   const handleDateRangeChange = (event) => {
//     setDateRange(event.target.value);
//   };

//   const handleShowModal = (details) => {
//     setcurrentTeamsDetails(details);
//     setShowModal(true);

//     // Fetch current team data based on team ID
//     const currentTeamId = details.teamId;
//     const currentTeamData = data.LiveSurvey.filter(
//       (survey) => survey.teamId === currentTeamId
//     );
//     setCurrentTeamData(currentTeamData);
//   };

//   const handleCloseModal = () => setShowModal(false);

//   return (
//     <div className="card agx">
//       <div className="container">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h4>Team Performance</h4>
//           <ExcelDownloadButton
//             data={supervisorDetails}
//             fileName={dateRange + " agentReport"}
//           />
//           <select
//             className="form-select-sm"
//             onChange={handleDateRangeChange}
//             value={dateRange}
//           >
//             <option value="allTime">All Time</option>
//             <option value="today">Today</option>
//             <option value="last7Days">Last 7 Days</option>
//           </select>
//         </div>
//         <ul className="agent-list">
//           {supervisorDetails.map((team, index) => (
//             <li key={index} className="agent-item">
//               <p className="agent-name">{team.name}</p>

//               <div className="d-flex flex-column mx-2">
//                 <p className="agent-score">Score: {team.score}</p>
//                 <Button
//                   variant="success"
//                   className="agentReportlbl"
//                   onClick={() => handleShowModal(team)}
//                 >
//                   See full report
//                 </Button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Team Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {currentTeamsDetails ? (
//             <div>
//               <p>Team Name: {currentTeamsDetails.name}</p>
//               <div className=" d-flex justify-center justify-content-around  ">
//                 <a
//                   href="#!"
//                   data-tooltip-id="Q1"
//                   data-tooltip-content={
//                     currentTeamsDetails.Question1_No +
//                       currentTeamsDetails.Question1_Yes >
//                     0
//                       ? (
//                           (currentTeamsDetails.Question1_Yes /
//                             (currentTeamsDetails.Question1_Yes +
//                               currentTeamsDetails.Question1_No)) *
//                           100
//                         ).toFixed(2)
//                       : 0
//                   }
//                 >
//                   <Button variant="info">Q1 Score</Button>
//                 </a>
//                 <Tooltip id="Q1"></Tooltip>

//                 <a
//                   href="#!"
//                   data-tooltip-id="Q2"
//                   data-tooltip-content={
//                     currentTeamsDetails.Question2_No +
//                       currentTeamsDetails.Question2_Yes >
//                     0
//                       ? (
//                           (currentTeamsDetails.Question2_Yes /
//                             (currentTeamsDetails.Question2_Yes +
//                               currentTeamsDetails.Question2_No)) *
//                           100
//                         ).toFixed(2)
//                       : 0
//                   }
//                 >
//                   <Button variant="info">Q2 Score</Button>
//                 </a>
//                 <Tooltip id="Q2"></Tooltip>

//                 <a
//                   href="#!"
//                   data-tooltip-id="Q3"
//                   data-tooltip-content={
//                     currentTeamsDetails.Question3_No +
//                       currentTeamsDetails.Question3_Yes >
//                     0
//                       ? (
//                           (currentTeamsDetails.Question3_Yes /
//                             (currentTeamsDetails.Question3_Yes +
//                               currentTeamsDetails.Question3_No)) *
//                           100
//                         ).toFixed(2)
//                       : 0
//                   }
//                 >
//                   <Button variant="info">Q3 Score</Button>
//                 </a>
//                 <Tooltip id="Q3"></Tooltip>
//               </div>
//               <p>
//                 Survey Response:{" "}
//                 {currentTeamsDetails.Question1_No +
//                   currentTeamsDetails.Question1_Yes}
//               </p>

//               <div className="tableDiv">
//                 <table className="agent-table">
//                   <thead>
//                     <tr>
//                       <th>Ani</th>
//                       <th>Date Time</th>
//                       <th>Q1</th>
//                       <th>Q2</th>
//                       <th>Q3</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentTeamData.map((survey, index) => (
//                       <tr
//                         key={index}
//                         className={index % 2 === 0 ? "even-row" : "odd-row"}
//                       >
//                         <td>{survey.aniNumber}</td>
//                         <td>{new Date(survey.createdAt).toLocaleString()}</td>
//                         <td>{survey.question1}</td>
//                         <td>{survey.question2}</td>
//                         <td>{survey.question3}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ) : (
//             <p>No data found</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default CardComponent;
