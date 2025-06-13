# ⚜️ AlertPay-OpenFinance

O **AlertPay-OpenFinance** é um ecossistema completo que simula uma plataforma de gerenciamento financeiro, integrando um backend robusto, uma interface de usuário moderna e um ambiente simulado de Open Finance com múltiplas APIs bancárias. O projeto foi desenhado para demonstrar a orquestração de microsserviços, automação de processos com Docker e a comunicação entre diferentes camadas de uma aplicação web.

## 📦 Componentes Principais

Este repositório unifica três componentes principais:

- **AlertPay-Backend**: O núcleo da aplicação, responsável pela lógica de negócio, gerenciamento de usuários, faturas e o agendamento e disparo de notificações.
- **AlertPay-NewProject-Front**: A interface do usuário, construída com React, que permite aos usuários interagir com a plataforma.
- **open-finance**: Um ambiente simulado com múltiplas APIs de instituições financeiras, seguindo os princípios do Open Finance.

## 🏛️ Arquitetura do Ecossistema

O projeto é orquestrado utilizando Docker e Docker Compose, criando uma rede de contêineres que se comunicam de forma isolada e eficiente.

### Rede Docker (openfinance-net)
Permite a comunicação entre todos os serviços do ecossistema.

### Contêineres

| Componente             | Descrição                                                                 |
|------------------------|---------------------------------------------------------------------------|
| `open-finance-db`      | Banco de dados PostgreSQL para APIs simuladas (porta 5433)               |
| `api-mini-bc`, etc.    | Microsserviços Node.js que simulam APIs bancárias (portas 3002, 3003...) |
| `alert-pay-db`         | Banco de dados PostgreSQL exclusivo do AlertPay (porta 5434)             |
| `alert-pay`            | API principal (porta 4000)                                               |
| `AlertPay-NewProject-Front` | Frontend React (porta 5173, rodando localmente)                        |

## ✨ Tecnologias Utilizadas

| Categoria        | Tecnologia             | Projeto(s)                    |
|------------------|------------------------|-------------------------------|
| Backend          | Node.js, Express       | AlertPay-Backend, open-finance |
| Frontend         | React, Vite            | AlertPay-NewProject-Front     |
| Banco de Dados   | PostgreSQL, Sequelize  | Todos                         |
| Orquestração     | Docker, Docker Compose | Todos                         |
| Autenticação     | JWT                    | AlertPay-Backend, open-finance |
| Comunicação HTTP | Axios                  | Todos                         |

## ⚙️ Pré-requisitos

- Git
- Node.js e npm (v18+)
- Docker e Docker Compose

## 🚀 Como Executar o Ecossistema

### 1. Iniciar o ambiente Open Finance

```bash
cd open-finance
docker network create openfinance-net
docker-compose up --build
```

### 2. Iniciar o backend

```bash
cd ../AlertPay-Backend
docker-compose up --build
```

### 3. Iniciar o frontend

```bash
cd ../AlertPay-NewProject-Front
npm install
npm run dev
```

Obs: caso de algum erro no `wait-for.sh ou no start.sh` mude no canto inferior do seu VSCODE de CRLF para LF e salve, apos isso execute novamente. 

### Acessos

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Bancos Simulados: http://localhost:3002, :3003...

## 🔧 Scripts Úteis

### open-finance

```bash
docker-compose exec <serviço> npx sequelize-cli db:migrate
./undo-migrations.sh
docker-compose logs -f <serviço>
docker-compose down --remove-orphans
```

### AlertPay-Backend

```bash
docker-compose exec alert-pay npx sequelize-cli db:migrate
docker-compose logs -f alert-pay
docker-compose down
```

### AlertPay-NewProject-Front

```bash
npm run dev
npm run build
npm run lint
```

## 📁 Estrutura do Projeto

```
/
├── AlertPay-Backend/
├── AlertPay-NewProject-Front/
├── open-finance/
└── README.md
```

## 🔌 Configurações

- **Frontend → Backend**: URL definida em `src/services/api.js`
- **Backend → Bancos**: Resolução via nomes Docker e mapeamento no `BankSessionController.js`

### Exemplo de Mapeamento Interno

| bankId            | Endpoint Docker                                    |
|-------------------|----------------------------------------------------|
| api-mini-bc       | http://open-finance-api-minibc-1:3002              |
| banco-central     | http://open-finance-bancocentral-1:3003           |
| bank-account-api  | http://open-finance-bank-account-api-1:3004       |
| mini-banco-central| http://open-finance-mini-banco-central-1:3005     |

## 📡 Principais Endpoints do Backend

### Públicas

| Método | Rota     | Descrição                       |
|--------|----------|----------------------------------|
| POST   | /users   | Criação de usuário              |
| POST   | /login   | Autenticação e JWT              |

### Protegidas (JWT)

| Método | Rota                        | Descrição                               |
|--------|-----------------------------|------------------------------------------|
| PUT    | /users                      | Atualiza usuário                         |
| GET    | /users                      | Retorna dados do usuário                 |
| DELETE | /users                      | Remove usuário                           |
| POST   | /bank-login                 | Conecta banco                            |
| GET    | /bank-logins                | Lista bancos conectados                  |
| DELETE | /bank-rm-login/:bankId      | Remove conexão bancária                  |
| POST   | /invoices                   | Cria fatura manual                       |
| GET    | /invoices?bankId=<id>       | Lista faturas do banco                   |
| GET    | /invoices/manual            | Lista faturas manuais                    |
| PUT    | /invoices/:id               | Atualiza fatura                          |
| POST   | /user-rules                 | Cria regra de notificação                |
| GET    | /user-rules                 | Lista regras do usuário                  |

## 📄 Licença

Distribuído sob a Licença MIT.
