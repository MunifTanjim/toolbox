FROM postgres:13.3-alpine

COPY docker-entrypoint-initdb.d/ /docker-entrypoint-initdb.d/

ENV PGDATA=/var/lib/postgresql/data/toolbox \
  POSTGRES_DB=toolbox

VOLUME ["/var/lib/postgresql/data/toolbox"]
