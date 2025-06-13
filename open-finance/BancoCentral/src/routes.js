import { Router } from 'express';

import authMiddlewares from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import AccountController from './app/controllers/AccountController';
import TransactionController from './app/controllers/TransactionController';
import InvoicesController from "./app/controllers/InvoicesController.js"

const routes = new Router();

// ROTAS PÚBLICAS (não precisam de token)
routes.post('/users', UserController.store);
// JSON ROUTE
// {
//   "cpf": "12345678910",
//   "name": "Eduardo Kroth",
//   "email": "eduardo@kroth.com",
//   "password": "senha123"
// }

//ROTA PARA FAZER LOGIN
routes.post('/login', SessionController.store);

routes.post('/transactions', TransactionController.store);
routes.put('/transactions/:id', TransactionController.update);

// A partir daqui, aplica middleware de autenticação
routes.use(authMiddlewares);

// ROTAS PROTEGIDAS (precisam do token JWT)
// ----------------------------------------

routes.put('/users', UserController.update);
// JSON ROUTE (exemplo para atualizar nome e email)
// {
//   "name": "Eduardo Kroth Silva",
//   "email": "eduardo.silva@kroth.com"
// }
// JSON ROUTE (exemplo para alterar senha)
// {
//   "oldPassword": "senha123",
//   "password": "novaSenha123",
//   "confirmPassword": "novaSenha123"
// }

routes.get('/users', UserController.index);
// Não há JSON para GET

routes.delete('/users', UserController.delete);
// Não há JSON para DELETE


// ROTAS PARA CRIAR AS CONTAS DO USUARIO
// ----------------------------------------
routes.post('/accounts', AccountController.store);
// JSON esperado:
// {
//   "type": "corrente",
//   "balance": 1000.00,
//   "bank_cnpj": "12345678000199"
// }
// Obs: O CPF do usuário virá do token (req.userCpf), então não precisa enviar.

routes.get('/accounts', AccountController.index);
// Retorna todas as contas do usuário autenticado (baseado no token)

routes.put('/accounts/:id', AccountController.update);
// JSON esperado (atualiza dados da conta):
// {
//   "type": "poupança",
//   "balance": 1500.00
// }

routes.delete('/accounts/:id', AccountController.delete);
// Não precisa de JSON
// Basta fazer DELETE em /accounts/ID_DA_CONTA

// Faturas
routes.post("/invoices", InvoicesController.store);
// Criar uma nova fatura
// POST /invoices
// JSON esperado:
/*
{
  "status": "Em aberto",       // Pode ser: "Vencida", "Paga" ou "Em aberto"
  "amount": 150.75,            // Valor positivo da fatura
  "description": "Conta de luz referente a maio", // Opcional
  "due_date": "2025-06-20"    // Data de vencimento no formato ISO (YYYY-MM-DD)
}
*/

routes.get("/invoices", InvoicesController.index);

export default routes;
