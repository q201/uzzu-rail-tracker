import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// RailRadar Master API Key (Stored securely on Render Server)
const RAILRADAR_API_KEY = process.env.RAILRADAR_API_KEY || 'rg_d21b4cd5252145dd8c55ab340bb81029';
const TARGET_BASE_URL = 'https://api.railradar.in/v1';

// Enable CORS for GitHub Pages & local development
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Uzzu Rail Tracker Render Proxy', timestamp: new Date().toISOString() });
});

// Secure RailRadar Proxy Catch-All Endpoint
app.get('/api/*', async (req, res) => {
  const subPath = req.params[0]; // e.g. "trains/12002/live" or "lookup/search/stations"
  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = `${TARGET_BASE_URL}/${subPath}${queryString ? `?${queryString}` : ''}`;

  try {
    const apiResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RAILRADAR_API_KEY}`,
        'X-API-Key': RAILRADAR_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const data = await apiResponse.json();
    res.status(apiResponse.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(500).json({
      success: false,
      error: { message: 'Render Proxy Gateway Timeout or Connection Error' }
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Uzzu Rail Tracker Render Proxy listening on port ${PORT}`);
});
