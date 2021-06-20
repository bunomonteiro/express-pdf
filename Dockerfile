FROM node:14-alpine

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

# Phantomjs installation
RUN apk --update add ttf-ubuntu-font-family fontconfig && rm -rf /var/cache/apk/*
ENV PHANTOMJS_VERSION=2.1.1
RUN apk add --no-cache curl && \
    cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/${PHANTOMJS_VERSION}/dockerized-phantomjs.tar.gz | tar xz && \
    cp -R lib lib64 / && \
    cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
    cp -R usr/share /usr/share && \
    cp -R etc/fonts /etc && \
    curl -k -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-${PHANTOMJS_VERSION}-linux-x86_64.tar.bz2 | tar -jxf - && \
    cp phantomjs-${PHANTOMJS_VERSION}-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs && \
    rm -fR phantomjs-${PHANTOMJS_VERSION}-linux-x86_64 && \
    apk del curl

RUN npm install && npm audit fix


EXPOSE ${SERVER_PORT}

CMD ["node", "./bin/www"]