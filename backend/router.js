// router.js
const express = require('express');
const router = express.Router();

// GETS 
const containersRoute = require('./routes/containersRouter');
const credentialsRoute = require('./routes/credentials');
const serveripsRoute = require('./routes/serverips');
const tagsRoute = require('./routes/tags');


// PUTS
const updateCredRoute = require('./routes/updateCred');


router.use('/api/containers', containersRoute);
router.use('/api/credentials', credentialsRoute);
router.use('/api/serverips', serveripsRoute);
router.use('/api/updateCred', updateCredRoute);
router.use('/api/tags', tagsRoute);


module.exports = router;

