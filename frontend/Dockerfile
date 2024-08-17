# Use an official Node.js LTS (Long Term Support) image as a base
FROM node:lts-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . /app/

# Build the application for production with Vite
RUN npm run build

# Stage 2: Production environment
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server to serve the static files
CMD ["nginx", "-g", "daemon off;"]
