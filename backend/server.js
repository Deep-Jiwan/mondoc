const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = require('./router');
const pino = require('pino');
const path = require('path');
const { ensureCountFileExists, requestLogger } = require('./counter');
require('./serverInit');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const app = express();
const port = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());

// Log requests and responses
app.use(requestLogger);

// Proxy route: expects URL pattern /proxy/:serverIp/:port/...
app.use('/proxy/:serverIp/:port', (req, res, next) => {
  const { serverIp, port } = req.params;
  const targetUrl = `http://${serverIp}:${port}`;
  logger.info(`Proxying request to ${targetUrl}${req.url}`);

  const proxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/proxy/${serverIp}/${port}`]: '',
    },
    onError: (err, req, res) => {
      logger.error({ err }, 'Proxy error');
      res.status(500).send('Proxy error.');
    },
  });

  proxy(req, res, next);
});

// Use your router for all other routes.
app.use(router);

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ensure the counts.json file exists before starting the server
ensureCountFileExists().then(() => {
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
});
