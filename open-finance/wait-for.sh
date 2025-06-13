#!/bin/sh

HOST_PORT=$1
shift
HOST=$(echo $HOST_PORT | cut -d : -f 1)
PORT=$(echo $HOST_PORT | cut -d : -f 2)

echo "Aguardando $HOST:$PORT ficar disponível..."

while ! nc -z $HOST $PORT; do
  sleep 1
done

echo "$HOST:$PORT está disponível. Rodando migrations..."

npx sequelize db:migrate

echo "Migrations finalizadas. Iniciando comando: $@"
exec "$@"
