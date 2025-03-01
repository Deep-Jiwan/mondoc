// containersService.js
const { exec } = require('child_process');
const fs = require('fs').promises; // asynchronous API
const fsSync = require('fs'); // for existsSync if needed
const crypto = require('crypto');
const util = require('util');
const pino = require('pino');

const execPromise = util.promisify(exec);
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Docker command constants
const DOCKER_PS_CMD = 'docker ps -a -q';
const DOCKER_INSPECT_CMD = 'docker inspect';

// File paths
const TAGS_FILE_PATH = './data/tags.json';
const CONTAINERS_FILE_PATH = './data/containers.json';

// Global in-memory cache and file modification times
let cacheData = null;
let lastContainersMTime = null;
let lastTagsMTime = null;

// Helper: get file modification time using fs.stat
async function getFileMTime(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtimeMs; // modification time in milliseconds
  } catch (err) {
    return null; // file might not exist
  }
}

// Helper: extract the required fields from a container object
function extractFields(container) {
  return {
    Names: container.Name || container.Names,
    State: container.State ? container.State.Status : null,
    Ports: container.NetworkSettings ? JSON.stringify(container.NetworkSettings.Ports) : null,
    Status: container.State ? container.State.Status : null,
    Networks: container.NetworkSettings ? container.NetworkSettings.Networks : null,
    CreatedAt: container.Created,
    ID: container.Id,
    Image: container.Config ? container.Config.Image : null,
    IP: container.NetworkSettings ? container.NetworkSettings.IPAddress : null,
    Port: null, // Customize if needed (e.g., derive from NetworkSettings)
    DummyUsername: container.Config && container.Config.Env ?
      (container.Config.Env.find(env => env.startsWith("DUMMY_USERNAME=")) || "").split('=')[1] : null,
    DummyPassword: container.Config && container.Config.Env ?
      (container.Config.Env.find(env => env.startsWith("DUMMY_PASSWORD=")) || "").split('=')[1] : null,
    Size: container.SizeRootFs || container.SizeRw || null,
    Mounts: container.Mounts || null,
    LocalVolumes: container.Mounts ? container.Mounts.filter(m => m.Type === 'volume') : null,
    Labels: container.Config ? container.Config.Labels : null,
  };
}

// Function to update container info by running Docker commands and merging with tags.
// Writes updated data to file, updates modification times, and refreshes the in-memory cache.
async function updateContainers() {
  try {
    // Get container IDs using docker ps
    const { stdout: psOutput } = await execPromise(DOCKER_PS_CMD);
    const ids = psOutput.trim().split('\n').filter(Boolean);

    // If no containers exist, prepare an empty data structure.
    if (ids.length === 0) {
      const emptyData = { containers: [] };
      await fs.writeFile(CONTAINERS_FILE_PATH, JSON.stringify(emptyData, null, 2));
      lastContainersMTime = await getFileMTime(CONTAINERS_FILE_PATH);
      cacheData = emptyData;
      return cacheData;
    }

    // Retrieve container details via docker inspect
    const { stdout: inspectOutput } = await execPromise(`${DOCKER_INSPECT_CMD} ${ids.join(' ')}`);
    const containersRaw = JSON.parse(inspectOutput);

    // Read tag information from the tags file (if it exists)
    let tags = {};
    try {
      const tagsData = await fs.readFile(TAGS_FILE_PATH, 'utf8');
      tags = JSON.parse(tagsData);
      lastTagsMTime = await getFileMTime(TAGS_FILE_PATH);
    } catch (err) {
      logger.error({ err }, 'Error reading tags file');
      tags = {};
      lastTagsMTime = null;
    }

    // Process each container to extract only the required fields and merge with tags.
    const containersWithFields = containersRaw.map(container => {
      const extracted = extractFields(container);
      // Use the first 12 characters of the container ID to match the tags file format.
      const shortId = container.Id.substring(0, 12);
      return { ...extracted, tags: tags[shortId] || [] };
    });

    const finalData = { containers: containersWithFields };
    await fs.writeFile(CONTAINERS_FILE_PATH, JSON.stringify(finalData, null, 2));
    lastContainersMTime = await getFileMTime(CONTAINERS_FILE_PATH);

    // Update the in-memory cache.
    cacheData = finalData;
    return cacheData;
  } catch (err) {
    logger.error({ err }, 'Error updating containers');
    throw err;
  }
}

// Function to refresh the cache if the underlying files have changed.
async function refreshIfNeeded() {
  try {
    const currentContainersMTime = await getFileMTime(CONTAINERS_FILE_PATH);
    const currentTagsMTime = await getFileMTime(TAGS_FILE_PATH);

    let refreshNeeded = false;
    if (currentContainersMTime && (!lastContainersMTime || currentContainersMTime > lastContainersMTime)) {
      refreshNeeded = true;
    }
    if (currentTagsMTime && (!lastTagsMTime || currentTagsMTime > lastTagsMTime)) {
      refreshNeeded = true;
    }
    if (refreshNeeded) {
      await updateContainers();
    }
    return cacheData;
  } catch (err) {
    logger.error({ err }, 'Error refreshing containers');
    throw err;
  }
}

// Simple getter for the in-memory cache.
function getCache() {
  return cacheData;
}

// Scheduled update: refresh the in-memory cache every 5 seconds.
setInterval(async () => {
  try {
    await updateContainers();
    logger.info('Cache updated via scheduled update');
  } catch (err) {
    logger.error({ err }, 'Scheduled update failed');
  }
}, 5000);

module.exports = {
  updateContainers,
  refreshIfNeeded,
  getCache,
};
