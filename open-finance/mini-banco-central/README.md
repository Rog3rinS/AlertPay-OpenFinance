# 💸 Mini Banco Central

Este projeto é uma API RESTful de um sistema bancário simplificado. Ele permite cadastro e autenticação de usuários, gerenciamento de contas bancárias, bancos e transações financeiras.

---

## 🚀 Tecnologias

- Node.js
- Express
- Sequelize (ORM)
- PostgreSQL
- JWT (Autenticação)
- dotenv

---

## 📦 Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/mini-banco-central.git
   cd mini-banco-central

2. **Instale as dependências:**:
    yarn install
        # ou
    npm install

3. **Configure o ambiente: Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:**:
    DB_HOST=localhost
    DB_USER=postgres
    DB_PASS=admin
    DB_NAME=mini_banco_central
    JWT_SECRET=f14cc8792e18ba4d87ebd0cb32b7a2a5
    JWT_EXPIRES=7d

4. **Crie o banco de dados no PostgreSQL com o nome definido (mini_banco_central).**
   
5. **Rode as migrações para criar as tabelas:**:
   npx sequelize db:migrate

🏁 Inicialização

1. **Para rodar o projeto, execute o comando**:

    yarn dev
        # ou
    npm run dev

    A aplicação ficará disponível em: http://localhost:3333

📮 Endpoints principais do users:

1. **POST /users – Cadastra um novo usuário**

    Descrição: Cria um novo usuário no sistema.

    Body (JSON):

    {
	    "cpf": "00014",
	    "name": "Ana1",
	    "email": "ana1@ana.com",
	    "password": "123456",
	    "address": "Rua 2"
    } 

2. **POST /sessions – Login e geração do token JWT**:
   
    Descrição: Realiza o login do usuário e retorna um token JWT.

    Body (JSON):  

    {
	"email": "ana@ana.com",
	"password": "123456"
    }

3. **GET /users – Lista usuários (requer token)**:
   
    Descrição: Lista todos os usuários cadastrados.

    Autenticação: Requer um token JWT no header Authorization: Bearer seu_token_aqui.

4. **PUT /users – Atualiza as informações do usuário**:
   
    Descrição: Atualiza a senha do usuário e os outros dados

    Body (JSON):

    {
        
	    "name": "Guilherme",
	    "email": "gui@gui.com",
	    "oldPassword": "123456",
	    "password": "123458",
	    "confirmPassword": "123458"

    }

5. **DELETE/users - Deleta um usuário**:
   
    Descrição: Deleta um usuário com o token dele. 

    Autenticação: Requer um token JWT no header Authorization: Bearer seu_token_aqui.

📮 Endpoints principais do banks:

1. **POST /banks – Cadastra um novo banco**

    Descrição: Cria um novo banco no sistema.

    Body (JSON):

    {
	    "cnpj": "00008",
        "name": "B2",
        "email": "b2@b2.com",
        "phone": "36511111",
        "address": "Rua 22"
    } 


2. **GET /banks – Lista bancos**:
   
    Descrição: Lista todos os bancos cadastrados.


3. **PUT /banks – Atualiza as informações do banco**:
   
    Descrição: Atualiza os dados do banco

    Body (JSON):

    {
        "name": "Teste Atualizado",
        "email": "b2@b2.com",
        "phone": "987654321",
        "address": "Rua Teste Atualizada, 456"
    }

4. **DELETE/banks/id_cnpj - Deleta um banco**:
   
    Descrição: Deleta um banco com o id_cnpj dele. 

📮 Endpoints principais do accounts:

1. **POST /accounts – Cadastra uma nova conta(requer token e body)**

    Descrição: Cria uma nova conta no sistema.

    Autenticação: Requer um token JWT no header Authorization: Bearer seu_token_aqui.

    Body (JSON):

    {
        "number": "12345678",
        "agency": "010",
        "type": "Corrente",
        "balance": 5000,
        "bank_cnpj": "00006"
    }


2. **GET /accounts – Lista as contas do banco(usa o token do usuário)**:
   
    Descrição: Lista todas as contas dos bancos cadastrados.

    Autenticação: Requer um token JWT no header Authorization: Bearer seu_token_aqui.


3. **PUT /accounts/id_account – Atualiza as informações da conta(body e token)**:
   
    Descrição: Atualiza os dados da conta.

    Autenticação: Requer um token JWT no header Authorization: Bearer seu_token_aqui.

    body(podendo acrescentar outras informações sobre a conta para serem trocadas):

    {
        "type": "Corrente"
    }

4. **DELETE/accounts/id_account - Deleta um banco**:
   
    Descrição: Deleta uma conta com o id_account dela. 

📮 Endpoints principais do transactions:

1. **POST /transactions – Cadastra uma nova transação(requer body)**

    Descrição: Cria uma nova transação no sistema.


    Body (JSON):

    {
        "type": "depósito",
        "amount": 200.00,
        "description": "deposito inicial",
        "date": "2025-04-19",
        "account_id": 7
    }   

2. **PUT /transactions/id_account – Atualiza as informações sobre o saldo da conta(body)**:
   
    Descrição: após criar a transação, aqui ela fica como concluida e é adicionada na conta, atualizando o saldo.


    body:

    {
        "type": "depósito",
        "amount": 200.00,
        "description": "saque inicial",
        "date": "2025-04-19",
        "account_id": 7,
	    "status": "concluido"
    }

💻 Ferramentas auxiliares
Para testar as rotas:
•	Insomnia
•	Postman
Para visualização do banco:
•	Postbird
ou outro client para PostgreSQL.

✅ Estrutura de pastas
src
├── app
│   ├── controllers
│   ├── middlewares
│   ├── models
├── config
│   ├── auth.js
│   └── database.js
├── database
│   ├── migrations
│   └── index.js
├── routes.js
└── app.js
🔐 Segurança
•	Senhas são armazenadas com hash (bcryptjs)
•	Autenticação com JSON Web Token
•	Variáveis sensíveis ficam no .env (ignorado pelo Git)
________________________________________
Feito com 💙 por Gabriela Lima


