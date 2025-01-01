# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Copy the rest of the application
COPY . .

# Copy the start script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose the Vite default port
EXPOSE 5173

# Start the app
CMD ["sh", "/usr/local/bin/start.sh"] 