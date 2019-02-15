FROM node:11-alpine

RUN apk update && apk add git

WORKDIR /application

ENV NODE_ENV=production \
    DB_AUTH_METHOD="SCRAM-SHA-256" \
    DB_COLLECTION_NAME="ptah" \
    DB_HOST=""   \
    DB_PORT=27017 \
    DB_NAME="ptah"   \
    DB_USER=""   \
    DB_PASS=""   \
    JWT_KEY=""   \
    NGINX_CONFIGS_DIR="/etc/nginx/landings/conf.d" \
    PUBLIC_HTML_DIR="/etc/nginx/landings/public/landings" \
    ROUTES_PREFIX="/api/v1" \
    SERVER_PORT=3000 \
    SENTRY_DSN="" \
    PUBLIC_HOST="" \
    AUTH1_CLIENT_ID="" \
    AUTH1_CLIENT_SECRET="" \
    AUTH1_CLIENT_SCOPE="openid,offline" \
    AUTH1_AUTHORIZE_URL="" \
    AUTH1_TOKEN_URL=""

COPY package.json /application

RUN npm install && npm prune --production

COPY . /application

RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]

