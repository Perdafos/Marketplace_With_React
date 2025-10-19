FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install all dependencies (including dev) for build
COPY package.json package-lock.json ./
RUN npm ci

# copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app

# copy production deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 4000
CMD ["node", "dist/index.js"]
