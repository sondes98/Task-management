FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Download wait-for-it.sh and make it executable
RUN apk add --no-cache curl && \
    curl -sS https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o wait-for-it.sh && \
    chmod +x wait-for-it.sh

# Copy the rest of your app files (it will not overwrite wait-for-it.sh if you add it first)
COPY . . 

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 5000

# Use wait-for-it.sh to ensure MySQL is ready, then start the app
CMD ["./wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start:dev"]
