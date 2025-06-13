#!/bin/sh

/wait-for.sh db:5432

echo "Rodando migrations..."
npx sequelize db:migrate

echo "Iniciando aplicação..."
npm start
