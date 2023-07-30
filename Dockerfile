# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=18.17.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy files
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src ./src

# Install dependencies and compile code
RUN npm install --include=dev
RUN npm install -g typescript
RUN tsc --build

# Expose the port that the application listens on.
EXPOSE 5000

# Run the application.
CMD ["node", "dist/main.js"]
