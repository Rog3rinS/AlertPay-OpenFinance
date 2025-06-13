# Emulador de Ecossistema Open Finance

Este projeto simula um ecossistema de Open Finance, construído com múltiplas APIs em Node.js que representam diferentes instituições e serviços financeiros. O ambiente é totalmente orquestrado com Docker e utiliza PostgreSQL como banco de dados.

O grande diferencial deste setup é a **automação**: ao iniciar os contêineres, os serviços aguardarão o banco de dados ficar pronto e, em seguida, executarão as *migrations* automaticamente antes de iniciar a aplicação.

## 🏛️ Arquitetura

O ambiente é composto por múltiplos microsserviços, cada um rodando em um contêiner Docker isolado. Eles se comunicam através de uma rede Docker e compartilham uma única instância de banco de dados PostgreSQL, mas com **schemas separados**.

| Serviço             | Porta Exposta (Local) | Descrição                                                 |
|---------------------|------------------------|------------------------------------------------------------|
| postgres            | 5433                   | Instância do banco de dados PostgreSQL que armazena os dados de todas as APIs. |
| api-mini-bc         | 3002                   | Simula a API de uma instituição financeira.                |
| banco-central       | 3003                   | Simula a API de uma instituição financeira.                |
| bank-account-api    | 3004                   | Simula a API de uma instituição financeira.                |
| mini-banco-central  | 3005                   | Simula a API de uma instituição financeira.                |

## ⚙️ Automação da Inicialização

Cada serviço de API (`api-mini-bc`, `banco-central`, etc.) utiliza um script de inicialização (`start.sh`) que:

- Usa o script `wait-for.sh` para garantir que o contêiner do banco de dados (`db:5432`) esteja totalmente operacional.
- Executa o comando `npx sequelize db:migrate` para criar e aplicar a estrutura de tabelas mais recente.
- Inicia o servidor da aplicação com `npm start`.

Isso **elimina a necessidade de executar as migrations manualmente**.

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar todo o ecossistema com um único comando.

### Pré-requisitos

Garanta que você tenha as seguintes ferramentas instaladas em sua máquina:

- **Git**: para clonar o repositório.
- **Docker e Docker Compose**: para orquestrar e executar os contêineres.

### 1. Clone o Repositório

```bash
git clone https://github.com/Rog3rinS/open-finance.git
cd open-finance
```

### 2. Inicie o Ambiente

Com o Docker em execução, utilize o Docker Compose para construir as imagens e iniciar todos os contêineres:

```bash
sudo docker compose up --build -d
```

Obs: Talvez seja necessario dar permissao para os scripts rodarem, para isso rode:

```bash
sudo chmod +x wait-for.sh start.sh
```

O Docker irá:

- Construir as imagens de cada serviço.
- Iniciar os contêineres em modo `detached` (`-d`).
- Configurar a rede `openfinance-net` para a comunicação interna.
- Executar os scripts de inicialização que automaticamente aplicarão as migrations.

Pronto! 🎉 Após alguns instantes, todo o ecossistema estará no ar e pronto para uso.

Você pode verificar os logs dos contêineres com:

```bash
docker compose logs -f <nome-do-servico>
```

## 🔧 Gerenciamento do Ambiente

### Endpoints das APIs

## 🔓 Rotas Públicas (Não requerem autenticação)

### ➕ Criar Usuário

**POST** `/users`

**JSON Exemplo:**
```json
{
  "cpf": "12345678910",
  "name": "Seu nome",
  "email": "seu-emai@gmail.com",
  "password": "senha123"
}
```

---

### 🔐 Login

**POST** `/login`

**JSON Exemplo:**
```json
{
  "email": "seu-emai@gmail.com",
  "password": "senha123"
}
```

---


## 🔒 Rotas Protegidas (Requerem token JWT)

---

### ✏️ Atualizar Usuário

**PUT** `/users`

**Atualizar nome e email:**
```json
{
  "name": "Seu nome atualizado",
  "email": "Seu-email-atualizado@gmail.com"
}
```

**Alterar senha:**
```json
{
  "oldPassword": "senha123",
  "password": "novaSenha123",
  "confirmPassword": "novaSenha123"
}
```

---

### 👤 Buscar Usuário

**GET** `/users`

**Resposta:** Dados do usuário autenticado.

---

### ❌ Deletar Usuário

**DELETE** `/users`

---

### ❌ Deletar Conta

**DELETE** `/accounts/:id`

---

## 🧾 Faturas

### ➕ Criar Fatura

**POST** `/invoices`

**JSON Exemplo:**
```json
{
  "status": "Em aberto",
  "amount": 150.75,
  "description": "Conta de luz referente a maio",
  "due_date": "2025-06-20"
}
```

---


### 💸 Criar Transação

**POST** `/transactions`

---

### ✏️ Atualizar Transação

**PUT** `/transactions/:id`

---


### 📄 Listar Faturas

**GET** `/invoices`

---

## 📌 Observações

- Todas as rotas protegidas requerem um token JWT no cabeçalho:
  ```
  Authorization: Bearer <seu_token_aqui>
  ```

- Os dados sensíveis do usuário (como CPF) são derivados do token e não devem ser enviados manualmente.

---

## 📄 Licença

Este projeto está licenciado sob os termos da Licença MIT.


### Resetando o Banco de Dados

Se precisar limpar o banco de dados e reverter todas as migrations (útil durante o desenvolvimento), você pode usar o script `undo-migrations.sh`.

Primeiro, dê permissão de execução:

```bash
chmod +x undo-migrations.sh
```

Depois, execute:

```bash
./undo-migrations.sh
```

Para recriar as tabelas, basta reiniciar os contêineres:

```bash
sudo docker compose restart
```

### Parar os Contêineres

Para parar e remover todos os contêineres, redes e volumes criados pelo ambiente:

```bash
sudo docker compose down --remove-orphans
```

---

## 📄 Licença

Este projeto está licenciado sob os termos da [Licença MIT](https://opensource.org/licenses/MIT).
