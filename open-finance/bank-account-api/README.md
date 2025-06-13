# API Agregadora de Contas Bancárias (Mini Banco Central)

Aplicação desenvolvida em Node.js com PostgreSQL para gerenciamento e agregação de contas bancárias.

**Entidades principais:**
- *Usuário*: cada usuário pode ter contas em diferentes instituições;
- *Instituição*: representa um banco (ex.: Itaú, Banco do Brasil);
- *Conta*: relaciona um usuário com uma instituição e posui saldo;
- *Transação*: representa um lançamento financeiro (crédito ou débito) em uma conta.

---

## Para rodar a API:

1. **Instale o Docker;**
- [Docker](https://www.docker.com/get-started/)


2. **Clone o repositório;**
    ```bash
    git clone https://github.com/Ana72Lu/bank-account-api.git
    ```


3. **Crie um arquivo `.env` na raiz do projeto conforme o exemplo:**
    ```bash
    POSTGRES_USER=seu_username
    POSTGRES_PASSWORD=seu_password
    POSTGRES_DB=nome-do-banco

    DB_NAME=nome-do-banco
    DB_USERNAME=nome_usuário_banco
    DB_PASSWORD=senha_usuário_banco
    DB_HOST=db

    PORT=XXXX #Porta (servidor da API) recomendada: 3333

    HASH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

- Para o `HASH_TOKEN` (token de autenticação JWT), crie um hash MD5 qualquer: [MD5 Hash Generator](https://www.md5hashgenerator.com/)


4. **Execute no terminal (dentro da pasta do projeto):**
    ```bash
    docker compose up --build
    ```

- Para problemas de conexão/autenticação, execute:
    ```bash
    docker compose down -v
    ```

- Obs.: o Docker Desktop deve estar rodando.

---

## Rotas:

### POST

1. **Método POST `/users`**
- Cria um novo usuário.
- Body:
    ```json
    {
        "name": "Teste",
        "email": "teste@gmail.com",
        "password": "teste123",
        "cpf": "3582593411"
    }
    ```


2. **Método POST `/sessions`**
- Cria uma nova sessão.
- Body:
    ```json
    {
        "email": "teste@gmail.com",
        "password": "teste123"
    }
    ```


3. **Método POST `/institutions`**
- Cadastra uma nova instituição.
- Body:
    ```json
    {
        "name": "Banco teste",
        "email": "banco@gmail.com",
        "cnpj": "45789400",
        "phone": "55-9932100"
    }
    ```


4. **Método POST `/users/:id/accounts`**
- Cria uma nova conta.
- Body:
    ```json
    {
        "institution_id": 1,
        "balance": 3000
    }
    ```


5. **Método POST `/users/:id/transactions`**
- Cria uma nova transação.
- `credit`: entrada.
- `debit`: saída.
- Body:
    ```json
    {
      "account_id": 1,
      "amount": 1500,
      "type": "debit",
      "description": "Pagar algo"
    }
    ```


### GET

1. **Método GET `/users`**
- Lista todos os usuários.


2. **Método GET `/users/:id/balance`**
- Consulta o saldo.
- Parâmetro (opcional): `institution`


3. **Método GET `/users/:id/statement`**
- Informa o extrato de transações.
- Parâmetros (opcionais): `institution`, `type`


4. **Método GET `/institutions`**
- Lista todas as instituições.


5. **Método GET `/accounts`**
- Lista todas as contas.


6. **Método GET `/users/:id/accounts`**
- Lista as contas de um usuário.


### PUT

1. **Método PUT `/users/:id`**
- Atualiza os dados do usuário.

---

## Para testar a API:

Utilize ferramentas/programas como Insomnia (recomendado), Postman e curl (linha de comando).
- [Insomnia](https://insomnia.rest/download)
- [Postman](https://www.postman.com/downloads/)

---

## Para finalizar a API:

- Execute no terminal:
    ```bash
    docker compose down
    ```
