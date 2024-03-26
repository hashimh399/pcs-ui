const express = require("express");
const axios = require("axios");
const sql = require("mssql");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

let accessToken = "";
let email = "";
let displayName = "";
let orgId = "";
let supervisorData = null;
let filteredTeamData = [];
const URL = "https://api.wxcc-us1.cisco.com";

const getUsers = async (accessToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const apiURL = `${URL}/organization/69fc3aba-280a-4f8e-b449-2c198d78569b/v2/user`;
    const response = await axios.get(apiURL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return { data: [] }; // Return empty data on error
  }
};

const getTeams = async (accessToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const apiURL = `${URL}/organization/69fc3aba-280a-4f8e-b449-2c198d78569b/team`;
    const response = await axios.get(apiURL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching teams:", error.message);
    return []; // Return empty array on error
  }
};

app.post("/api/receive-token", async (req, res) => {
  accessToken = req.body.accessToken;
  email = req.body.emails[0];
  displayName = req.body.displayName;
  orgId = req.body.orgId;

  try {
    const usersData = await getUsers(accessToken);
    const teamData = await getTeams(accessToken);
    const usersMap = usersData.data.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    supervisorData = usersData.data.find((user) => user.email === email);
    if (!supervisorData) {
      return res.status(404).send("Supervisor not found.");
    }

    teams = supervisorData.teamIds || [];
    const supTeams = teamData.filter((team) => teams.includes(team.id));
    filteredTeamData = supTeams.map((team) => {
      const users = team.userIds
        .map((userId) => usersMap[userId])
        .filter((user) => user);
      return {
        id: team.id,
        name: team.name,
        users,
      };
    });

    res.status(200).send("User data has been processed and stored.");
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/logged-in-supervisor", cors(), (req, res) => {
  if (!supervisorData) {
    return res.status(404).send("Supervisor data not available.");
  }

  const response = {
    supervisorName: displayName,
    supervisorEmail: email,
    teamList: teams,
    teamData: filteredTeamData,
  };
  res.json(response);
});

//Database setup and APIs
// SQL Server configuration
const dbConfig = {
  user: "sa",
  password: "cons@123",
  server: "192.168.1.120",
  database: "PCS",
  encrypt: true,
  trustServerCertificate: true,
};

// POST CallDetails Req
app.post("/callDetails", async (req, res) => {
  console.log(`Call Recieved - Call Details`);
  console.log("Request body:", req.body);
  // res
  //   .status(200)
  //   .send({ message: "Received POST request at /post1", data: req.body });

  try {
    await sql.connect(dbConfig).then(() => {
      console.log("db Connection set successfully");
      let { intreactionId, agentId, teamId, ANI } = req.body;
      let currentDate = new Date().toISOString();
      const result = sql.query`INSERT INTO dbo.inCall (InteractionId, TeamID, AgentID, ANI , Date) VALUES (${intreactionId}, ${agentId}, ${teamId}, ${ANI} , ${currentDate})`;
      res.status(201).send("Data inserted successfully");
      console.log("Table updated");
    });
  } catch (err) {
    console.log(`db operation failed ${err}`);
    if (!res.headersSent) {
      res.status(500).send("Failed to insert data");
    }
  }
});

app.post("/feedback", async (req, res) => {
  console.log("Routed to PCS - Feedback");
  console.log("Request body:", req.body);

  // Destructure request body
  let { intreactionId, Q1, Q2, Q3, ANI } = req.body;
  let currentDate = new Date().toISOString();
  try {
    // Ensure dbConfig is defined and correctly configured
    await sql.connect(dbConfig);
    console.log("Database connection set successfully");

    // Execute the query and wait for it to complete
    await sql.query`INSERT INTO dbo.surveyRes (InteractionId, Q1, Q2, Q3, ANI, Date) VALUES (${intreactionId}, ${Q1}, ${Q2}, ${Q3}, ${ANI}, ${currentDate})`;

    console.log("Table Updated");
    res.status(201).send("Data Inserted successfully");
  } catch (err) {
    console.log(`Database operation error: ${err.message}`);
    // Ensure a response is sent only once per request
    if (!res.headersSent) {
      res.status(500).send("Failed to insert data");
    }
  }
});

//fetch survey values for all time
app.get("/alltime-data", async (req, res) => {
  try {
    // Ensure database connection is established
    await sql.connect(dbConfig);

    // Execute the SQL query
    const result = await sql.query`
      SELECT IC.InteractionId, IC.TeamID, IC.AgentID, IC.ANI, SR.Q1, SR.Q2, SR.Q3, IC.Date
      FROM inCall IC
      FULL JOIN surveyRes SR ON IC.InteractionId = SR.InteractionId
    `;

    // Send query results as JSON
    res.json(result.recordset);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).send("Failed to fetch data");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
