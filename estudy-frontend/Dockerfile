FROM node:22-alpine
LABEL authors="fijizxli"

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
