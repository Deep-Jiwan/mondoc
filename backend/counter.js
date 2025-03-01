const fs = require('fs').promises;
const path = require('path');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const COUNT_FILE = path.join(__dirname, '/data/counts.json');

// Ensure counts.json exists
async function ensureCountFileExists() {
  try {
    await fs.mkdir(path.dirname(COUNT_FILE), { recursive: true });

    try {
      await fs.access(COUNT_FILE);
    } catch (err) {
      // File does not exist, create it with an empty JSON object
      await fs.writeFile(COUNT_FILE, JSON.stringify({}, null, 2));
      logger.info('Created counts.json file.');
    }
  } catch (err) {
    logger.error('Error ensuring counts.json exists:', err);
  }
}

// Function to update request count and response codes
async function updateRequestLog(method, endpoint, statusCode) {
  try {
    let data = {};

    // Read existing data (if file exists)
    try {
      const rawData = await fs.readFile(COUNT_FILE, 'utf8');
      data = JSON.parse(rawData);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    const key = `${method} ${endpoint}`;

    // Ensure entry exists
    if (!data[key]) {
      data[key] = { count: 0, responses: {} };
    }

    // Increment request count
    data[key].count += 1;

    // Track response codes
    data[key].responses[statusCode] = (data[key].responses[statusCode] || 0) + 1;

    // Write back updated log
    await fs.writeFile(COUNT_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    logger.error('Error updating request log:', err);
  }
}

// Middleware to log API calls
function requestLogger(req, res, next) {
  logger.info({ method: req.method, url: req.originalUrl }, 'API Request Received');

  res.on('finish', async () => {
    const statusCode = res.statusCode;
    await updateRequestLog(req.method, req.originalUrl, statusCode);
    logger.info({ method: req.method, url: req.originalUrl, status: statusCode }, 'API Response Sent');
  });

  next();
}

module.exports = { ensureCountFileExists, requestLogger };
