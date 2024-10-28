FROM node:20-alpine AS builder
WORKDIR /app

COPY . .
COPY package*.json ./
RUN npm fund
RUN npm install
RUN npm install -g serve
RUN npm run build

FROM node:20-alpine AS starter
COPY --from=builder/app/build /app/build
CMD ["serve", "-s", "build"]
