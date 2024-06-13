# Use an official Node.js runtime as a parent image
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . /app/

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]


