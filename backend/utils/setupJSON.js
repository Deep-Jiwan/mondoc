// setupJSON.js

// WORK IN PROGRRESS. THIS SCRIPT WILL EVENTUALLY BE USED TO SETUP THE JSON FILE THAT ARE BEING USED AS DATABASE 



const { execSync } = require('child_process');
const fs = require('fs');

const tagsFilePath = './tags.json';
const credFilePath = './credentials.json';
const containersFilePath = './containers.json';

// Get all container IDs (for all containers)
function getAllContainerIDs() {
  try {
    const output = execSync('docker ps -a -q', { encoding: 'utf8' });
    const ids = output.trim().split('\n').filter(Boolean);
    return ids;
  } catch (error) {
    console.error('Error getting container IDs:', error);
    return [];
  }
}

// Initialize tags.json
function initializeTagsJSON(containerIDs) {
  let tagsData = {};
  // If file exists, try to load it; otherwise, use an empty object.
  if (fs.existsSync(tagsFilePath)) {
    try {
      tagsData = JSON.parse(fs.readFileSync(tagsFilePath, 'utf8'));
    } catch (error) {
      console.error('Error reading tags.json, reinitializing:', error);
      tagsData = {};
    }
  }
  // For each container ID, ensure an entry exists
  containerIDs.forEach((id) => {
    if (!tagsData.hasOwnProperty(id)) {
      tagsData[id] = [];
    }
  });
  // Write (or create) the file with the updated data.
  fs.writeFileSync(tagsFilePath, JSON.stringify(tagsData, null, 2));
  console.log('Initialized tags.json');
}

// Initialize cred.json
function initializeCredJSON(containerIDs) {
  let credData = {};
  if (fs.existsSync(credFilePath)) {
    try {
      credData = JSON.parse(fs.readFileSync(credFilePath, 'utf8'));
    } catch (error) {
      console.error('Error reading cred.json, reinitializing:', error);
      credData = {};
    }
  }
  containerIDs.forEach((id) => {
    if (!credData.hasOwnProperty(id)) {
      credData[id] = { username: "", password: "" };
    }
  });
  fs.writeFileSync(credFilePath, JSON.stringify(credData, null, 2));
  console.log('Initialized cred.json');
}

// Initialize containers.json with raw container info
function initializeContainersJSON() {
  try {
    const outputIDs = execSync('docker ps -a -q', { encoding: 'utf8' });
    const ids = outputIDs.trim().split('\n').filter(Boolean);
    let containersData = { containers: [] };
    if (ids.length > 0) {
      const inspectOutput = execSync(`docker inspect ${ids.join(' ')}`, { encoding: 'utf8' });
      const containersRaw = JSON.parse(inspectOutput);
      containersData.containers = containersRaw;
    }
    // Also include an empty array for serverips (to be updated by the API)
    containersData.serverips = [];
    fs.writeFileSync(containersFilePath, JSON.stringify(containersData, null, 2));
    console.log('Initialized containers.json');
  } catch (error) {
    console.error('Error initializing containers.json:', error);
  }
}

// Main setup function
function setupJSONFiles() {
  const containerIDs = getAllContainerIDs();
  console.log('Found container IDs:', containerIDs);
  initializeTagsJSON(containerIDs);
  initializeCredJSON(containerIDs);
  initializeContainersJSON();
}

// Run the setup when this file is required
setupJSONFiles();
