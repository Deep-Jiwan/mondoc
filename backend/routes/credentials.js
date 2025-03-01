const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const CREDENTIALS_FILE = path.join(__dirname, '../data/credentials.json');

// Ensure credentials file exists
if (!fs.existsSync(CREDENTIALS_FILE)) {
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify({}, null, 2));
}

router.get('/', (req, res) => {
  const containerId = req.query.containerId; // Assuming containerId is passed as a query param
  if (!containerId) {
    return res.status(400).json({ error: "Missing containerId parameter" });
  }

  // Read existing credentials
  let credentials = {};
  if (fs.existsSync(CREDENTIALS_FILE)) {
    try {
      credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
    } catch (err) {
      return res.status(500).json({ error: "Failed to read credentials.json" });
    }
  }

  // Ensure container ID exists, otherwise initialize blank credentials
  if (!credentials[containerId]) {
    credentials[containerId] = { username: "", password: "" };
    
    // Save the updated credentials
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));
  }

  console.log(`Fetched credentials for ${containerId}:`, credentials[containerId]); // Debug log
  res.json(credentials[containerId]); // Return only the requested container's credentials
});

module.exports = router;
