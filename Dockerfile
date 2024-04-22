FROM node:alpine

COPY src /app/src
COPY package*.json /app

WORKDIR /app
RUN npm install --production

CMD npm run start-prod

