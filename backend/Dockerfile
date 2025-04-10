FROM node:20-alpine

WORKDIR /app

# Install curl, bash, and netcat-openbsd for waiting
RUN apk add --no-cache curl bash netcat-openbsd

# Copy package.json and package-lock.json for npm install
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port 5000
EXPOSE 5000

# Wait for MySQL to be ready using nc and then start the app
CMD /bin/sh -c 'until nc -z mysql 3306; do echo "Waiting for MySQL..."; sleep 2; done; npm run start:dev'
