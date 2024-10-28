FROM node:20-alpine AS build
WORKDIR /app

COPY . .
COPY package*.json ./
RUN npm fund
RUN npm install
RUN npm install -g serve
RUN npm run build
RUN serve -s build -l 80
