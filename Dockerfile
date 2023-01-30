#!/bin/bash
FROM --platform=linux/amd64 node:18.12.1 as base


WORKDIR /var/app/current

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

ENV NODE_PATH=./bin

CMD [ "sh", "-c", "npm run start:prod"]
EXPOSE 80