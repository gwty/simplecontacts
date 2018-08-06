FROM postgres:alpine

ENV POSTGRES_DB contacts
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD sql



COPY contacts.sql init-user-db.sh /docker-entrypoint-initdb.d/
# CMD sh /docker-entrypoint-initdb.d/init-user-db.sh



# CMD psql -h localhost -p 5432 -d contacts -1 -f /restore/db.sql

# replace this with your application's default port
EXPOSE 5432

