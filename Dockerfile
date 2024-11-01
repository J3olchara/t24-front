FROM node:20-alpine AS builder
WORKDIR /app

COPY . .
COPY package*.json ./
RUN npm install
RUN npm run build

FROM node:20-alpine AS starter
COPY --from=builder /app/build /app/build
WORKDIR /app/build
RUN npm install -g serve
CMD ["serve", "-s", "."]
