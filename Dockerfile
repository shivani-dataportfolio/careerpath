# Multi-stage build for React frontend and Node backend

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Final Image
FROM node:18-alpine
WORKDIR /app

# Backend Setup
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend/ ./backend/

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend-dist

# Serve the app
EXPOSE 8000
CMD ["node", "backend/server.js"]
