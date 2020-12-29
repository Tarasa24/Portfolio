FROM node:14.15.0
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY src/package.json /usr/src/app/package.json
RUN npm install --production
RUN npm audit fix

COPY src /usr/src/app
RUN npm run generate

CMD [ "npm", "run", "start" ]
