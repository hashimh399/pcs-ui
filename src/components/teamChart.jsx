import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useWebSocket } from "../utils/websocket";

const ChartCarousel = ({ allData }) => {
  const { data } = useWebSocket();
  const [allTeamData, setAllTeamData] = useState([]);
  const [dateRange, setDateRange] = useState("allTime");
  const [supervisorDetails, setSupervisorDetails] = useState([]);

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
        };
      });

      setSupervisorDetails(newData);
    }
  }, [allData, allTeamData, dateRange]);

  useEffect(() => {
    setDateRange("allTime");
  }, [data]);

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  return (
    <>
      <div>
        {/* <button onClick={handleSendMessage}>Refresh </button> */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="chartlbl">Team Wise Report</h4>
          <select
            className="form-select-sm duration"
            onChange={handleDateRangeChange}
            value={dateRange}
          >
            <option value="allTime">All Time</option>
            <option value="today">Today</option>
            <option value="last7Days">Last 7 Days</option>
          </select>
        </div>
        <BarChart width={550} height={300} data={supervisorDetails}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#8884d8" />
        </BarChart>
      </div>
    </>
  );
};

export default ChartCarousel;
