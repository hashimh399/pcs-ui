import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
    // State to hold survey data
    const [surveyData, setSurveyData] = useState({
      labels: [], // Assume these are your question or survey categories
      datasets: [] // Data for each chart will go here
    });
  
    // Fetch survey data (mocked for this example)
    useEffect(() => {
      // This is where you would fetch data from your backend
      // For demonstration, we'll use static data
      const fetchData = () => {
        setSurveyData({
          labels: ['Question 1', 'Question 2', 'Question 3'],
          datasets: [
            {
              label: 'Survey 1 Responses',
              data: [65, 59, 80],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1
            }
          ]
        });
      };
  
      fetchData();
    }, []);
  
    // The render part of our component
    return (
      <div>
        <h2>Survey Results Dashboard</h2>
        {/* Bar Chart Example */}
        {/* <Bar data={surveyData} options={{ maintainAspectRatio: false }} /> */}
  
        {/* More charts can be added in a similar manner */}
      </div>
    );
  };
  
  export default Dashboard;
  