// routes/updateCred.js
const express = require('express');
const fs = require('fs');
const pino = require('pino');
const path = require('path');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const router = express.Router();

router.post('/', (req, res) => {
  logger.info('API called: POST /api/updateCred');
  
  const { payload } = req.body;
  if (!payload) {
    logger.error('No payload provided');
    return res.status(400).json({ error: 'No payload provided' });
  }

  let decrypted;
  try {
    // Decode the payload from Base64 and parse the JSON
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    decrypted = JSON.parse(decoded);
    logger.info({ decrypted }, 'Payload decoded successfully');
  } catch (error) {
    logger.error({ error }, 'Error decrypting payload');
    return res.status(400).json({ error: 'Invalid payload format' });
  }

  const { username, password, containerid } = decrypted;
  if (!containerid) {
    logger.error('containerid is required');
    return res.status(400).json({ error: 'containerid is required' });
  }

  // Load existing credentials from credentials.json (or use an empty object)
  const filePath = path.join(__dirname, '../data/credentials.json');
  
  let credentials = {};
  if (fs.existsSync(filePath)) {
    try {
      logger.info(`Reading file: ${filePath}`);
      credentials = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (err) {
      logger.error({ err }, 'Error reading credentials.json');
    }
  } else {
    logger.info(`File not found: ${filePath}, initializing credentials as empty object`);
  }

  // Update (or add) the credentials for the given container ID
  credentials[containerid] = { username, password };
  logger.info({ containerid, username, password }, 'Updated credentials object');

  // Save the updated credentials back to credentials.json
  try {
    logger.info(`Writing updated credentials to file: ${filePath}`);
    fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2));
  } catch (err) {
    logger.error({ err }, 'Error writing to credentials.json');
    return res.status(500).json({ error: 'Error saving credentials' });
  }

  logger.info(`Credentials updated successfully for containerid: ${containerid}`);
  res.json({ message: 'Credentials updated successfully' });
});

module.exports = router;


/*

Accepts a Base64-encoded JSON payload in the request body.
Decodes and parses the payload.
Validates the required containerid field.
Reads credentials.json (if it exists).
Updates the credentials for the given containerid.
Saves the updated credentials back to credentials.json.
Responds with a success message or an appropriate error.

*/