FROM node:22

WORKDIR /app

# Copia todos os arquivos da API para o diretório /app no container
COPY . .

# Instala o netcat-openbsd e as dependências do projeto
RUN apt-get update && apt-get install -y netcat-openbsd \
  && rm -rf /var/lib/apt/lists/* \
  && npm install

# Garante permissão de execução caso use wait-for.sh
RUN chmod +x /wait-for.sh || true

# Comando principal: executa a aplicação
CMD ["npm", "start"]
