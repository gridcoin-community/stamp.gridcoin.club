FROM node:16-alpine3.15

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN rm -rf ./node_modules

RUN npm install

CMD ["npm", "run", "dev"]