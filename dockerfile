# Stage 1: Build the application
FROM node:14-alpine AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json for npm install
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Stage 2: Create a minimal runtime image
FROM node:14-alpine

WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app /usr/src/app

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
