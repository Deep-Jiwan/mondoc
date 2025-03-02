# mondoc

A lightweight monitoring and tagging tool for Docker containers built with React and Node.js.

---
## Purpose of mondoc

mondoc was created to provide a lightweight tool that gathers key container information and supports container tagging and proxy connectivity. While tools like Portainer offer robust container management and Homer delivers a sleek dashboard view, mondoc fills a niche by focusing on essential information retrieval without the overhead of comprehensive management features. Additionally, mondoc includes login management capabilities, allowing users to store and manage credentials for web-based container applications to simplify access and streamline operations.

## Disclaimer

**Not Production Ready**  
mondoc is under active development and is provided "as is" for testing and evaluation purposes only. It may contain bugs, incomplete features, and performance issues. Do NOT use it in production.

---

## Note from the Author

I believe AI is a powerful tool for building applications like mondoc. As the project lead, I carefully defined the features, design, and security measures. AI assisted by providing initial code templates and design suggestions, which I reviewed, refined, and integrated. Think of AI as a supportive tool—like code templates or libraries—rather than a substitute for thoughtful, custom development. Your suggestions, reviews, and feedback are greatly appreciated.

---

## Contributions

### Author Contributions:
1. **Design & Architecture:** Defined the overall system and feature set.
2. **Core Implementation:** Developed core functionality, integrated components, and managed Docker communication.
3. **Review & Integration:** Refined all contributions to ensure consistency and security.

### AI Contributions:
1. **Code Templates & Drafts:** Provided initial code templates and draft segments.
2. **Design Suggestions:** Offered ideas that helped improve development and overall design.
3. **Auxiliary Code:** Contributed minor code segments.


## Overview

**mondoc** is designed to collect real‑time metrics from your Docker containers and let you tag and filter them for improved visibility and management. It features a React-based UI built with Tailwind CSS and a Node.js backend that communicates with Docker. Additionally, mondoc lets you store login information for web-based or login-based containers and provides a proxy connection to access your services.

---

## Features

- **Tagging System:** Easily tag containers for filtering and monitoring.
- **Lightweight:** Designed for minimal resource usage in production environments. (So i hope)
- **Docker Integration:** Seamlessly integrates with Docker environments.
- **Save Logins:** Stores your container login credentials securely.
- **Proxy Connect:** Create a proxy to connect to your services effortlessly.

- **Access Control** Though currently there is no login component, this service can easily be put behind a cloudflare zero trust Access portal to provide that funcionality when accessing the app from a remote location.

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

## Setup and Build

For local development, please use the provided local run scripts. These scripts take care of dependency installation, asset building, and server startup.

For Docker-based development, utilize the provided Docker Compose configuration. This setup allows you to build and run the applicaiton directly

Further documentation and updates will be released in due time.


## Future Features

- **Login System:** Develop an authentication mechanism for secure access to the dashboard and user-specific configurations.
- **Enhanced Password Management:** Introduce improved password handling with encryption and integration with external vaults for secure credential storage.
- **Security Audit:** Implement continuous security scanning and vulnerability audits of container images and running containers.
- **Container Management Tools:** Add features to start, stop, create, and manage containers directly from the dashboard, simplifying lifecycle operations.
- **Advanced Metrics & Logging:** Integrate real-time metrics, historical data analysis, and detailed logging to offer deeper insights into container performance.
- **Alerting & Notifications:** Configure customizable alerts and notifications to promptly inform users about critical container events.


## Thank you for visitng and going through this documentation

