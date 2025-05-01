FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production --silent && mv node_modules ../ && chown -R node /usr/src/app

COPY . .

EXPOSE 4000

CMD ["node", "index.js"]