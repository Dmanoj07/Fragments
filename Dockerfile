######Dockerfile

# Build stage
FROM node:18.18.0 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source files
COPY ./src ./src

# Production stage
FROM node:18.18.0-alpine

LABEL maintainer="Manoj Dhami<mdhami7@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Set environment variables
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built assets from the build stage
COPY --from=build /app/src ./src

# Copy .htpasswd file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
