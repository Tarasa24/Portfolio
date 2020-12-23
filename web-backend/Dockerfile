FROM node:14

COPY src/package.json package.json
RUN npm install
RUN npm audit fix

COPY src .

CMD [ "npm",  "run", "start" ]
