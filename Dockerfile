FROM node:20-alpine AS build
WORKDIR /app

COPY . .
COPY package*.json ./
RUN npm install
RUN npm i react-scripts
RUN npm run build

CMD ["npm", "start"]
