FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

EXPOSE 8000

USER node

CMD [ "npm", "start" ]
