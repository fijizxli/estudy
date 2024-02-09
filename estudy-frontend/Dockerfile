FROM node:20-alpine
LABEL authors="fijizxli"
MAINTAINER fijizxli


WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
