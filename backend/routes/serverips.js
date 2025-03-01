// routes/serverips.js
const express = require('express');
const os = require('os');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const router = express.Router();

router.get('/', (req, res) => {
  logger.info('API called: GET /api/serverips');
  const ips = getServerIPs();
  logger.info({ ips }, 'Retrieved server IPs');
  res.json({ serverips: ips });
});

// Helper: Return all external IPv4 addresses
function getServerIPs() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const iface in nets) {
    for (const net of nets[iface]) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips;
}

module.exports = router;



/*

- Retrieves all network interfaces from the operating system using `os.networkInterfaces()`.
- Iterates through each interface and its associated network configurations.
- Filters out any addresses that are not IPv4 or that are internal (e.g., localhost).
- Collects external IPv4 addresses into an array.
- Returns this array, providing a list of server-accessible IP addresses.

*/