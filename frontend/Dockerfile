FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM node:18-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist .

EXPOSE 5173

CMD ["serve", "-s", ".", "-l", "5173"]
