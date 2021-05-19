FROM node:12

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./functions/package.json ./functions/.

