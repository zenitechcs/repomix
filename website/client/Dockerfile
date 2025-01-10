FROM node:22-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run docs:build

EXPOSE 5173

CMD ["npm", "run", "docs:dev"]
