const express = require('express');
const router = express.Router();
const containersService = require('./containersService');
const crypto = require('crypto');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Store last sent data hash
let lastDataHash = null;

// Function to generate an MD5 hash of JSON data
function generateHash(data) {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

// GET / -> Check for file changes and refresh cache if needed, then return container data.
router.get('/', async (req, res) => {
  logger.info('API called: GET /containers');
  try {
    await containersService.refreshIfNeeded();
    const newData = containersService.getCache() || { containers: [] };
    
    const newDataHash = generateHash(newData);

    if (lastDataHash && lastDataHash === newDataHash) {
      // No change in data, return 204
      logger.info('204 : No change');
      return res.status(204).end();
    }

    // Update last sent hash and send response
    lastDataHash = newDataHash;
    res.json(newData);
  } catch (err) {
    logger.error({ err }, 'Error in GET /containers');
    res.status(500).json({ error: 'Error processing request' });
  }
});

// GET /force -> Force an update regardless of file modification times.
router.get('/force', async (req, res) => {
  logger.info('API called: GET /containers/force');
  try {
    const updatedData = await containersService.updateContainers();    
    const newDataHash = generateHash(updatedData);
    lastDataHash = newDataHash;
    res.json(updatedData);
  } catch (err) {
    logger.error({ err }, 'Error in GET /containers/force');
    res.status(500).json({ error: 'Error processing request' });
  }
});

module.exports = router;
