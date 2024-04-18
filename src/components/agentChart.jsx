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

const AgentCarousel = ({ allData }) => {
  const { data } = useWebSocket();
  const [allAgentData, setAllAgentData] = useState([]);
  const [dateRange, setDateRange] = useState("allTime");
  const [agentData, setAgentData] = useState([]);

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
    if (data && data.AgentWiseReport && data.AgentWiseReport.length > 0) {
      setAllAgentData(data.AgentWiseReport[0]);
    }
  }, [data]);

  useEffect(() => {
    if (allData.SupervisorDetails && allData.SupervisorDetails.teamsData) {
      const teamsData = allData.SupervisorDetails.teamsData;

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

      console.log("unique agents are: ", uniqueAgents);

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

      const newData = uniqueAgents.map((agent) => {
        const AgentData = filteredAllAgentData.find(
          (data) => data.agentId === agent.id
        );
        const score = AgentData ? calculateScore(AgentData) : 0;
        return {
          name: agent.name,
          score: parseFloat(score), // Convert score to a float
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

  return (
    <>
      <div>
        {/* <button onClick={handleSendMessage}>Refresh </button> */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="chartlbl">Agent Wise Report</h4>
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
        <BarChart width={550} height={300} data={agentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#02c9bf" />
        </BarChart>
      </div>
    </>
  );
};

export default AgentCarousel;
