# Build
FROM node:14.15.0-alpine AS BUILD_IMAGE

RUN apk update && apk add yarn curl bash python g++ make && rm -rf /var/cache/apk/*

RUN curl -sfL https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin
WORKDIR /usr/src/app
COPY src/package.json src/yarn.lock ./

RUN yarn --frozen-lockfile

COPY src .

RUN yarn build
RUN npm prune --production
RUN /usr/local/bin/node-prune

# Execute
FROM node:14.15.0-alpine
WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/ .

EXPOSE 8080
ENV NODE_ENV=production

CMD [ "node_modules/nuxt/bin/nuxt.js", "start" ]
