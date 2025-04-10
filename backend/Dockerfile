# Use the Alpine version of Node.js
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# ✅ Add bash before using wait-for-it.sh
RUN apk add --no-cache bash curl && \
    curl -sS https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o wait-for-it.sh && \
    chmod +x wait-for-it.sh

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000:5000

# Use wait-for-it to ensure MySQL is available before starting the application
CMD ["./wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start:dev"]
