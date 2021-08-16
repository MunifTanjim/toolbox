FROM node:15-alpine as builder

RUN apk add --no-cache libc6-compat

WORKDIR /toolbox

COPY ./package.json ./yarn.lock ./
COPY ./apps/frontend/package.json ./apps/frontend/

RUN cd apps/frontend && yarn install --focus --frozen-lockfile && cd ../..

COPY ./tsconfig.base.json ./
COPY ./apps/frontend/next-env.d.ts ./apps/frontend/next.config.js ./apps/frontend/tsconfig.json ./apps/frontend/tsconfig.prod.json ./apps/frontend/
COPY ./apps/frontend/src ./apps/frontend/src

RUN cd apps/frontend && yarn run compile && yarn install --focus --forzen-lockfile --production && cd ../..

FROM node:15-alpine

RUN apk add --no-cache bash

WORKDIR /toolbox

COPY --from=builder --chown=node ./toolbox/node_modules ./node_modules
COPY --from=builder --chown=node ./toolbox/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=builder --chown=node ./toolbox/apps/frontend/build/src ./apps/frontend/src
COPY --chown=node ./apps/frontend/public ./apps/frontend/public
COPY --chown=node ./apps/frontend/next.config.js ./apps/frontend/
COPY --chown=node ./apps/frontend/package.json ./apps/frontend/
COPY --chown=node ./apps/frontend/jsconfig.prod.json ./apps/frontend/jsconfig.json
COPY --chown=node ./apps/frontend/scripts/docker-entrypoint.prod.sh ./apps/frontend/docker-entrypoint.sh

RUN chown node ./apps/frontend

USER node

RUN mkdir -p ./apps/frontend/.next

ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

WORKDIR /toolbox/apps/frontend

VOLUME ["/toolbox/apps/frontend/.env", "/toolbox/apps/frontend/.env.local", "/toolbox/apps/frontend/.next"]

ENTRYPOINT ["./docker-entrypoint.sh"]
