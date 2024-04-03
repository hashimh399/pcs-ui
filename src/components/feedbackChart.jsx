import React, {useState, useEffect} from 'react';
import Slider from 'react-slick';
import '../utils/pcs.css';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import { useWebSocket } from "../utils/websocket";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';


function surveyScore(responses) {
  const validResponses = responses.filter(response => response !== null);
  const yesCount = validResponses.reduce((acc, response) => acc + (response === "Yes" ? 1 : 0), 0);
  const avgScore = validResponses.length > 0 ? (yesCount / validResponses.length)*100 : 0;
  //console.log(validResponses,yesCount,avgScore);
  return avgScore;
}


const FeedbackCarousel = () => {
  const { sendMessage, data } = useWebSocket();
  const [selection, setSelection] = useState('allTime'); 
  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };
  useEffect(() => {
    if (selection) {
      console.log(`showing data for ${selection}`);
      // sendMessage({
      //   data: { api: selection },
      // });
    }
  }, [selection, sendMessage]);
  const relevantData = data[selection];

  return (
  
    <>
     
      <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className='chartlbl'>Live Survey</h4>
          <select className="form-select-sm" onChange={handleSelectionChange} value={selection}>
            <option value="AllTimeReport">All Time</option>
            <option value="today">Today</option>
            <option value="SevenDaysScore">Last 7 Days</option>
          </select>
          </div>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#82ca9d" />
        </LineChart>
      </div>
   </>

  );
};

export default FeedbackCarousel;
