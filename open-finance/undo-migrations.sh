#!/bin/bash

set -e

echo "🔄 Iniciando undo de todas as migrations para os serviços..."

# bank-account-api
echo "🔹 Desfazendo todas as migrations: bank-account-api"
sudo docker exec -it open-finance-bank-account-api-1 npx sequelize db:migrate:undo:all

# mini-banco-central
echo "🔹 Desfazendo todas as migrations: mini-banco-central"
sudo docker exec -it open-finance-mini-banco-central-1 npx sequelize db:migrate:undo:all

# bancocentral
echo "🔹 Desfazendo todas as migrations: bancocentral"
sudo docker exec -it open-finance-bancocentral-1 npx sequelize db:migrate:undo:all

# api-minibc
echo "🔹 Desfazendo todas as migrations: api-minibc"
sudo docker exec -it open-finance-api-minibc-1 npx sequelize db:migrate:undo:all

echo "✅ Todas as migrations foram desfeitas com sucesso!"
