const fs = require('fs');
const path = require('path');

function initializeJsonFiles() {
  const dataDir = path.join(__dirname, 'data');

  // Create the data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Data directory created.');
  }

  const files = [
    'credentials.json',
    'tags.json',
    'counts.json',
    'containers.json'
  ];

  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // Create file with an empty JSON object
      fs.writeFileSync(filePath, '{}', 'utf8');
      console.log(`${file} created.`);
    } else {
      console.log(`${file} already exists.`);
    }
  });
}

// Run the function on server startup
initializeJsonFiles();

// Export the function if needed elsewhere in your project
module.exports = { initializeJsonFiles };
