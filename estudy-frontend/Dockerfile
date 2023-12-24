FROM node:20-alpine
LABEL authors="fijizxli"
MAINTAINER fijizxli

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
