FROM mhart/alpine-node:14

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN rm -rf ./node_modules

RUN npm install

CMD ["npm", "run", "dev"]