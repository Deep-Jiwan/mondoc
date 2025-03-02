# mondoc

A lightweight monitoring and tagging tool for Docker containers built with React and Node.js.

---

## Overview

**mondoc** is designed to collect real‑time metrics from your Docker containers and let you tag and filter them for improved visibility and management. It features a React-based UI built with Tailwind CSS and a Node.js backend that communicates with Docker. Additionally, mondoc lets you store login information for web-based or login-based containers and provides a proxy connection to access your services.

---

## Features

- **Tagging System:** Easily tag containers for filtering and monitoring.
- **Lightweight:** Designed for minimal resource usage in production environments.
- **Docker Integration:** Seamlessly integrates with Docker environments.
- **Save Logins:** Stores your container login credentials securely.
- **Proxy Connect:** Create a proxy to connect to your services effortlessly.

---

## Architecture

- **Frontend:** Built with React and styled using Tailwind CSS to deliver a responsive, modern UI.
- **Backend:** A Node.js API handles data collection, container interactions, and serves the UI.
- **Containerization:** The application is packaged with Docker for easy deployment and scalability.

---

## Installation

### Prerequisites

- **Docker & Docker Compose:** Ensure these are installed and running.
- **Git:** To clone the repository.
- **Node.js & npm:** (For local development and building assets)

### Setup & Build Steps

Below is a shell script outlining the steps to build the dashboard (frontend) and backend assets. You can save the following script as `setup.sh` (remember to make it executable with `chmod +x setup.sh`):

```bash
#!/bin/bash
set -e  # Exit immediately if a command fails

# Build the dashboard (React app)
echo "Building dashboard..."
cd dashboard
npm install
npm run build

# Copy the built frontend to the backend's public folder
echo "Copying dashboard build to backend..."
rm -rf ../backend/public
mkdir -p ../backend/public
cp -r dist/* ../backend/public/

# Setup the backend
echo "Setting up backend..."
cd ../backend
npm install

# Start the backend server
echo "Starting backend server..."
node server.js
