FROM node:20-alpine AS build
WORKDIR /app

COPY . .
COPY package*.json ./
RUN npm install
RUN npm run build
RUN serve -s build

CMD ["npm", "start"]
