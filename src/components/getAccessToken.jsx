import React, { useState, useEffect } from 'react';


let supData = "";
function App() {
  const [accessToken, setAccessToken] = useState('');
  let supData = "";
  useEffect(() => {
    fetch('http://localhost:4000/api/logged-in-supervisor')
      .then((response) => response.json())
      .then((data) => {
       supData = JSON.stringify(data);
       console.log(data);
       // setAccessToken(data.accessToken); // Update the state with the fetched token
      })
      .catch((error) => console.error('Error fetching token:', error));
  }, []);

  return (
    <div>
      <h1>Access Token</h1>
      {supData ? (
        <p>{supData}</p> // Display the token
      ) : (
        <p>Loading...</p> // Show a loading message or similar feedback until the token is loaded
      )}
    </div>
  );
}

export default App;
