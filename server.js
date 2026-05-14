const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

async function getAccessToken() {
  const response = await axios.post('https://www.strava.com/oauth/token', {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    refresh_token: process.env.STRAVA_REFRESH_TOKEN,
    grant_type: 'refresh_token'
  });

  return response.data.access_token;
}

app.get('/strava/activities', async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const activities = await axios.get(
      'https://www.strava.com/api/v3/athlete/activities',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    res.json(activities.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Strava activities' });
  }
});

app.get('/', (req, res) => {
  res.send('Strava backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
