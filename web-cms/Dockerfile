# Build
FROM node:14.15.0-alpine AS BUILD_IMAGE

RUN apk update && apk add yarn curl bash && rm -rf /var/cache/apk/*

RUN curl -sfL https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin
WORKDIR /usr/src/app
COPY src/package.json src/yarn.lock ./

RUN yarn --frozen-lockfile

COPY src .

ENV NODE_ENV production

RUN yarn build
RUN npm prune --production
RUN /usr/local/bin/node-prune

# Execute
FROM node:14.15.0-alpine
WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/.cache ./.cache
COPY --from=BUILD_IMAGE /usr/src/app/build ./build
COPY src .

VOLUME /usr/src/app/public/uploads

EXPOSE 1337
ENV NODE_ENV=production
ENV DATABASE_HOST=
ENV DATABASE_PORT=3306
ENV DATABASE_NAME=
ENV DATABASE_USERNAME=
ENV DATABASE_PASSWORD=
ENV ADMIN_JWT_SECRET=
ENV STRAPI_URL=

CMD [ "server.js" ]