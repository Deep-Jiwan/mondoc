#!/bin/bash

set -e  # Exit immediately if a command fails

cd dashboard
npm install
npm run build

rm -rf ../backend/public
mkdir -p ../backend/public

cp -r dist/* ../backend/public/

cd ..
cd backend
npm install
node server.js
