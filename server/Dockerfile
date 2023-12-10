FROM node:18-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
COPY .env.prod .env
ENV NODE_ENV=production

RUN npm run postinstall
RUN npm run build

CMD [ "npm", "start"]