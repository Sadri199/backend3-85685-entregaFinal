# Stage 1: build
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies based on package-lock
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build

# Stage 2: runtime
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]