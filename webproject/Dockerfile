# Use the official Node.js image as the base image
FROM node:22.3.0-alpine

# Set the working directory inside the container
WORKDIR /frontend

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app for production
RUN npm run build

# Ensure games directory is copied to the dist folder
RUN cp -r public/games dist/games

# Install a simple web server to serve the built app
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000

# Start the web server and serve the built app
CMD ["serve", "-s", "dist", "-l", "3000"]
