FROM node:15-alpine as builder

WORKDIR /toolbox

COPY ./package.json ./yarn.lock ./
COPY ./apps/backend/package.json ./apps/backend/

RUN cd apps/backend && yarn install --focus --frozen-lockfile && cd ../..

COPY ./tsconfig.base.json ./
COPY ./apps/backend/tsconfig.json ./apps/backend/
COPY ./apps/backend/src ./apps/backend/src
COPY ./apps/backend/types ./apps/backend/types

RUN yarn run build:backend && yarn install --forzen-lockfile --production

FROM node:15-alpine

RUN apk add --no-cache bash

WORKDIR /toolbox

COPY --from=builder /toolbox/node_modules ./node_modules
COPY --from=builder /toolbox/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /toolbox/apps/backend/build ./apps/backend/build
COPY ./apps/backend/.pino-prettyrc.js ./apps/backend/
COPY ./apps/backend/scripts/docker-entrypoint.prod.sh ./apps/backend/docker-entrypoint.sh

USER node

ENV NODE_ENV=production

EXPOSE 9000

WORKDIR /toolbox/apps/backend

VOLUME ["/toolbox/apps/backend/.env", "/toolbox/apps/backend/.env.local"]

ENTRYPOINT ["./docker-entrypoint.sh"]
