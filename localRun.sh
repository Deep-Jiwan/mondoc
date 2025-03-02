#!/bin/bash

set -e  # Exit immediately if a command fails

cd dashboard
npm run build

rm -rf ../backend/public
mkdir -p ../backend/public

cp -r dist/* ../backend/public/

cd ..
cd backend
node server.js
