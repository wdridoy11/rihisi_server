const express = require('express');
require("dotenv").config();
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001; // Choose a different port if 3001 is in use

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.post('/createMeeting', async (req, res) => {
  const data = {
    endDate: '2099-02-18T14:23:00.000Z',
    fields: ['hostRoomUrl'],
  };

  try {
    const response = await axios.post('https://api.whereby.dev/v1/meetings', data, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_VIDEO_KEY}`, // give your api key
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
