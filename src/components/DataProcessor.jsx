import React from "react";

const DataProcessor = ({ data }) => {
  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format as per locale
  };

  // Process data
  const processedData = data.map((item) => ({
    date: formatTimestamp(item.timestamp),
    name: item.agentName,
    id: item.agentId,
    q1Response: item.Question1_Yes ? "Yes" : "No",
    q2Response: item.Question2_Yes ? "Yes" : "No",
    q3Response: item.Question3_Yes ? "Yes" : "No",
  }));

  // Log processed data for verification
  console.log(processedData);

  return <div>Data processed successfully!</div>;
};

export default DataProcessor;
