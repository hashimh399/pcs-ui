import React , {useState} from 'react';
import { Modal, Button , Dropdown} from 'react-bootstrap';
import '../utils/pcs.css';
const CardComponent = () => {
  
  const agents = [
    { name: 'Team_UniDash', score: 95 },
    { name: 'Team_UniAgt', score: 88 },
    { name: 'Team_wxcc', score: 95 },
    { name: 'Team_UniH', score: 88 },
    { name: 'Team_UniV', score: 95 },
  
   
  ];
  const [dateRange, setDateRange] = useState('allTime');

  // Handle changing the date range
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
    // Here, you would also update the data displayed based on the selected date range
  };
  const [showModal, setShowModal] = useState(false);
  const [currentAgentDetails, setCurrentAgentDetails] = useState('');

  const handleShowModal = (details) => {
    setCurrentAgentDetails(details);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="card agx">
      <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 >Team Performance</h4>
          <select className="form-select-sm" onChange={handleDateRangeChange} value={dateRange}>
            <option value="allTime">All Time</option>
            <option value="today">Today</option>
            <option value="last7Days">Last 7 Days</option>
          </select>
          </div>
        <ul className="agent-list">
          {agents.map((agent, index) => (
            <li key={index} className="agent-item">
              <p className="agent-name">{agent.name}</p>
              <a className='agentReportlbl' href="#!" onClick={() => handleShowModal(agent.details)}>See full report</a>
              <p className="agent-score">Score: {agent.score}</p>
            </li>
          ))}
        </ul>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Team Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>{currentAgentDetails}</Modal.Body>
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
