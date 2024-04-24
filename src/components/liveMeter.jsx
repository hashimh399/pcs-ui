import React, { useState, useEffect } from "react";
import "../utils/pcs.css";

function generateQuote(score) {
  let quote = "";
  let caseKey;

  // Determine the case key based on score ranges
  if (score >= 80 && score <= 100) {
    caseKey = "excellent";
  } else if (score >= 50 && score < 80) {
    caseKey = "good";
  } else if (score < 50) {
    caseKey = "poor";
  } else {
    caseKey = "invalid";
  }

  // Use switch statement to assign quotes
  switch (caseKey) {
    case "excellent":
      quote =
        "Your commitment to customer service excellence is evident. Keep up the great work!";
      break;
    case "good":
      quote =
        "Good effort! Let's focus on key areas to enhance our service further and inspire even greater customer satisfaction.";
      break;
    case "poor":
      quote =
        "We need to step up our efforts in customer service. Every challenge is an opportunity to improve and excel.";
      break;
    default:
      quote = "Invalid score. Please enter a score between 0 and 100.";
      break;
  }

  return quote;
}

function PerformanceMeter() {
  // State to store performance data
  const [performanceData, setPerformanceData] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    networkThroughput: 0,
  });

  // Simulated function to fetch performance data
  const fetchPerformanceData = () => {
    return {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      networkThroughput: Math.random() * 100,
    };
  };

  // Effect to handle the periodic update
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newData = fetchPerformanceData();
      setPerformanceData(newData);
      console.log("Updated data:", newData);
    }, 120000); // 120000 milliseconds = 2 minutes

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  const quote = generateQuote(50);
  // Render the component
  return (
    <div className="card performance-card">
      <h1>Live Performance Metrics</h1>
      <div className="card-body">
        <p>Contact Center Score 50</p>
        <p>Memory Usage: {quote}</p>
      </div>
    </div>
  );
}

export default PerformanceMeter;
