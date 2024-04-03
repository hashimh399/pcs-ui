import Slider from 'react-slick';
import React , {useState} from 'react';
import { Modal, Button , Dropdown} from 'react-bootstrap';
import '../utils/pcs.css';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import { useWebSocket } from '../utils/websocket';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';


const data = [
  {name: 'Team A', score: 40},
  {name: 'Team B', score: 30},
  {name: 'Team C', score: 20},
  {name: 'Team D', score: 27},
  {name: 'Team E', score: 100},
];

const ChartCarousel = () => {
  const { sendMessage } = useWebSocket();

  const handleSendClick = () => {
    // Example message
    const message = {
      api: 'UpdateStatus',
      data: { status: 'active' },
    };
    
    sendMessage(message);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const [dateRange, setDateRange] = useState('allTime');

  // Handle changing the date range
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
    // Here, you would also update the data displayed based on the selected date range
  };
  return (
   <>
      <div>
           <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className='chartlbl'>Team Wise Report</h4>
          <select className="form-select-sm duration" onChange={handleDateRangeChange} value={dateRange}>
            <option value="allTime">All Time</option>
            <option value="today">Today</option>
            <option value="last7Days">Last 7 Days</option>
          </select>
        </div>
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#8884d8" />
        </BarChart>
      </div>
      {/* <div>
        <h2>Line Chart</h2>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#82ca9d" />
        </LineChart>
      </div> */}
      </>
  );
};

export default ChartCarousel;
