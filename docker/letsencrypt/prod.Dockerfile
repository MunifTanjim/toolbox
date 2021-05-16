FROM certbot/certbot

RUN apk --no-cache add bash

COPY bin/ /usr/local/bin/

ENV NODE_ENV=production

VOLUME ["/etc/letsencrypt", "/certbot-webroot"]

ENTRYPOINT ["/usr/local/bin/run.sh"]
