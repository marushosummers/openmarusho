FROM openjdk:slim

RUN set -ex \
    && apt-get update \
    && apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash \
    && apt-get install -y nodejs \
    && apt remove cmdtest \
    && apt remove yarn \
    && curl https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y yarn \
    && npm install -g firebase-tools

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./functions/package.json ./functions/.

