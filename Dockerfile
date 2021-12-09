FROM node:16.13.1-alpine

WORKDIR /src/app/

COPY . .

ENV APP_TITLE="PDF Generator"
ENV APP_DESCRIPTION="PDF generator as a service"
ENV APP_VERSION=1.0.0
ENV SERVER_PORT=9090
ENV SERVER_REQUEST_LIMIT=1mb
ENV SERVER_LOG=true
ENV SERVER_LOG_MSG=
ENV SERVER_LOG_TRASNPORT_CONSOLE=
ENV SERVER_LOG_TRASNPORT_FILE=
ENV SERVER_LOG_TRASNPORT_HTTP=
ENV SERVER_LOG_TRASNPORT_STREAM=
ENV CHROMIUM_BIN="/usr/bin/chromium-browser"

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    eudev-libs \
    flac \
    libx11 \
    libxcomposite \
    libxdamage \
    libxext \
    libxfixes \
    libxrandr \
    alsa-lib \
    atk \
    at-spi2-atk \
    libatomic \
    at-spi2-core \
    ffmpeg-libs \
    musl \
    cairo \
    cups-libs \
    dbus-libs \
    libdrm \
    libevent \
    expat \
    fontconfig \
    freetype \
    mesa-gbm \
    libgcc \
    glib \
    harfbuzz \
    libjpeg-turbo \
    lcms2 \
    nspr \
    nss \
    opus \
    pango \
    libpng \
    re2 \
    snappy \
    libstdc++ \
    libwebp \
    libxcb \
    libxkbcommon \
    libxml2 \
    libxshmfence \
    libxslt \
    zlib \
    ttf-opensans \
    xdg-utils \
    ttf-freefont \
    chromium

RUN npm install && npm audit fix

RUN apk del --no-cache make gcc g++ binutils-gold gnupg libstdc++ && rm -rf /usr/include && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* && echo

EXPOSE ${SERVER_PORT}

CMD ["node", "./bin/www"]