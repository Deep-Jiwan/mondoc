// routes/tags.js
const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const tagsFilePath = path.join(__dirname, '../data/tags.json');

// Helper: load tags from tags.json, or create it if it doesn't exist with an empty object.
function loadTags() {
  if (!fs.existsSync(tagsFilePath)) {
    try {
      // Create tags.json with an empty object structure.
      fs.writeFileSync(tagsFilePath, JSON.stringify({}, null, 2));
      return {};
    } catch (err) {
      console.error('Error creating tags.json:', err);
      return {};
    }
  }
  try {
    const data = fs.readFileSync(tagsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading tags.json:', err);
    return {};
  }
}

// Helper: save tags to tags.json.
function saveTags(tags) {
  fs.writeFileSync(tagsFilePath, JSON.stringify(tags, null, 2));
}

// GET /api/tags - get tags for all containers.
router.get('/', (req, res) => {
  try {
    const currentTags = loadTags();
    res.json(currentTags);
  } catch (error) {
    console.error('Error loading tags:', error);
    res.status(500).json({ error: 'Error loading tags.' });
  }
});

// POST /api/tags - update the tags for a given container.
// Expected payload: { containerId: "someId", tags: [{ name: "tagName", color: "#xxxxxx" }, ...] }
router.post('/', (req, res) => {
  const { containerId, tags } = req.body;
  if (!containerId || !Array.isArray(tags)) {
    return res.status(400).json({ error: 'Invalid payload: containerId and tags are required.' });
  }

  // Load the existing tags object.
  const currentTags = loadTags();

  if (currentTags.hasOwnProperty(containerId)) {
    const existingTags = currentTags[containerId];
    // Remove any existing tag that is not sent in the payload.
    let updatedTags = existingTags.filter(existingTag =>
      tags.some(newTag => newTag.name.toLowerCase() === existingTag.name.toLowerCase())
    );

    // For each tag in the payload, update if exists or add if not.
    tags.forEach(newTag => {
      const idx = updatedTags.findIndex(tag => tag.name.toLowerCase() === newTag.name.toLowerCase());
      if (idx !== -1) {
        // Update the color if it's different.
        if (updatedTags[idx].color !== newTag.color) {
          updatedTags[idx].color = newTag.color;
        }
      } else {
        // Append the new tag.
        updatedTags.push(newTag);
      }
    });

    currentTags[containerId] = updatedTags;
  } else {
    // If no tags exist yet for this container, add the new tags directly.
    currentTags[containerId] = tags;
  }

  try {
    saveTags(currentTags);
    res.json({ message: 'Tags updated successfully.' });
  } catch (error) {
    console.error('Error writing to tags.json:', error);
    res.status(500).json({ error: 'Error updating tags.' });
  }
});

module.exports = router;
