FROM node:20-alpine AS base

FROM base as build

WORKDIR /app
RUN apk add --no-cache git
RUN npm i -g pnpm

COPY package.json .
COPY tsconfig.json .

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm db:generate-types
RUN pnpm build

RUN pnpm prune --prod --no-optional --ignore-scripts

FROM base as release

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 4200

ENTRYPOINT ["node", "./dist/src/main.js"]