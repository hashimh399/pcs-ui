import React, { useState, useEffect } from "react";
import "../utils/pcs.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

const FeedbackCarousel = ({ allData }) => {
  const [liveSurveyData, setLiveSurveyData] = useState([]);
  const [q1Count, setQ1Count] = useState(0);
  const [q2Count, setQ2Count] = useState(0);
  const [q3Count, setQ3Count] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selection, setSelection] = useState("allTime");

  useEffect(() => {
    if (allData && allData.LiveSurvey) {
      setLiveSurveyData(allData.LiveSurvey[0]);
      calculateCounts(allData.LiveSurvey[0]);
    }
  }, [allData]);

  const calculateCounts = (data) => {
    let q1 = 0,
      q2 = 0,
      q3 = 0,
      total = data.length - 2;

    data.forEach((survey) => {
      if (survey.question1 === "Yes" || survey.question1 === 1) q1++;
      if (survey.question2 === "Yes" || survey.question2 === 1) q2++;
      if (survey.question3 === "Yes" || survey.question3 === 1) q3++;
      if (survey.question1 === null) total--;
      else if (survey.question2 === null) q2--;
      else if (survey.question3 === null) q3--;
    });
    setQ1Count(q1);
    setQ2Count(q2);
    setQ3Count(q3);
    setTotalCount(total);
  };

  const calculateScore = (count, totalCount) => {
    return totalCount > 0 ? (count / totalCount) * 100 : 0;
  };

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };

  useEffect(() => {
    if (selection === "today" || selection === "SevenDaysScore") {
      const currentDate = new Date();
      const filteredData = liveSurveyData.filter((survey) => {
        const surveyDate = new Date(survey.createdAt);
        const diffTime = Math.abs(currentDate - surveyDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return selection === "today" ? diffDays === 0 : diffDays <= 7;
      });
      calculateCounts(filteredData);
    } else if (selection === "allTime") {
      calculateCounts(liveSurveyData);
    }
  }, [selection, liveSurveyData]);

  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="chartlbl">Live Survey</h4>
          <select
            className="form-select-sm"
            onChange={handleSelectionChange}
            value={selection}
          >
            <option value="allTime">All Time</option>
            <option value="today">Today</option>
            <option value="SevenDaysScore">Last 7 Days</option>
          </select>
        </div>

        <LineChart
          width={570}
          height={400}
          data={[
            {
              name: "Q1",
              score: calculateScore(q1Count, totalCount).toFixed(2),
            },
            {
              name: "Q2",
              score: calculateScore(q2Count, totalCount).toFixed(2),
            },
            {
              name: "Q3",
              score: calculateScore(q3Count, totalCount).toFixed(2),
            },
          ]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis type="number" domain={[0, 100]} ticks={[0, 33, 67, 100]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </>
  );
};

export default FeedbackCarousel;
