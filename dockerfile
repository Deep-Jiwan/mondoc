# Step 1: Build the frontend
FROM node:20.11.0 AS frontend-builder
WORKDIR /app/dashboard
COPY dashboard/package*.json ./
RUN npm install
COPY dashboard ./
RUN npm run build

# Step 2: Set up the backend
FROM node:20.11.0 AS backend
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm install

# Copy backend code
COPY backend ./

# Copy frontend build to backend
COPY --from=frontend-builder /app/dashboard/dist ./public

RUN apt update && apt install -y docker.io

# Expose port and start backend
EXPOSE 5001
CMD ["node", "server.js"]
