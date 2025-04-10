FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Ensure wait-for-it.sh is copied explicitly
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh
RUN ls -l /app/wait-for-it.sh

COPY . . 

RUN npm run build

EXPOSE 5000

CMD ["/app/wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start:dev"]
