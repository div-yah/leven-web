FROM node:20-alpine AS build

WORKDIR /app

# VITE_API_URL is baked into the static bundle at build time (Vite env
# vars are compile-time, not runtime) - Railway should pass it as a
# build-time variable for this service.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=build /app/dist ./dist

ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
