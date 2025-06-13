import * as Yup from 'yup';
import Invoice from '../models/Invoices.js';
import Account from '../models/Account.js';
import Bank from '../models/Bank.js';
import { getDefaultBankCnpj } from '../../config/initBank.js';

class InvoicesController {
	async store(req, res) {
		const schema = Yup.object().shape({
			status: Yup.string()
				.oneOf(["Vencida", "Paga", "Em aberto"], 'Status inválido. Use "Vencida", "Paga" ou "Em aberto".')
				.required('O status é obrigatório.'),
			amount: Yup.number()
				.positive('O valor deve ser positivo.')
				.required('O valor é obrigatório.'),
			description: Yup.string().nullable(),
			due_date: Yup.date()
				.typeError('A data de vencimento deve ser uma data válida.')
				.required('A data de vencimento é obrigatória.'),
		});

		try {
			await schema.validate(req.body, { abortEarly: false });
		} catch (err) {
			return res.status(400).json({ error: 'Falha na validação.', messages: err.errors });
		}

		const {
			status,
			amount,
			description,
			due_date,
		} = req.body;

		const userCpf = req.userCpf;

		try {
			const bankCnpj = getDefaultBankCnpj();

			const bank = await Bank.findOne({ where: { cnpj: bankCnpj } });

			if (!bank) {
				return res.status(500).json({ error: 'Instituição atual não encontrada.' });
			}

			const account = await Account.findOne({
				where: {
					user_cpf: userCpf,
					bank_cnpj: bankCnpj,
				}
			});

			if (!account) {
				return res.status(400).json({ error: 'Conta não encontrada para esse usuário neste banco.' });
			}

			const invoice = await Invoice.create({
				account_id: account.id,
				status,
				amount,
				description,
				due_date,
				institution_cnpj: bank.cnpj,
			});

			return res.status(201).json(invoice);

		} catch (error) {
			console.error("Erro ao criar fatura:", error);
			return res.status(500).json({ error: 'Erro interno do servidor ao tentar criar a fatura.' });
		}
	}
	async index(req, res) {
		const userCpf = req.userCpf;

		try {
			const bankCnpj = getDefaultBankCnpj();

			const bank = await Bank.findOne({ where: { cnpj: bankCnpj } });

			if (!bank) {
				return res.status(500).json({ error: 'Instituição atual não encontrada.' });
			}

			// Busca as contas do usuário neste banco
			const accounts = await Account.findAll({
				where: {
					user_cpf: userCpf,
					bank_cnpj: bankCnpj,
				},
				attributes: ['id'], // só precisamos do id para buscar as faturas
			});

			if (accounts.length === 0) {
				return res.status(404).json({ error: 'Nenhuma conta encontrada para o usuário neste banco.' });
			}

			const accountIds = accounts.map(acc => acc.id);

			// Busca as faturas dessas contas
			const invoices = await Invoice.findAll({
				where: {
					account_id: accountIds,
					institution_cnpj: bankCnpj,
				},
				include: [
					{
						model: Account,
						as: 'account',
						attributes: ['id', 'type', 'balance'],
					},
					{
						model: Bank,
						as: 'bank',
						attributes: ['cnpj', 'name'],
					}
				],
				order: [['due_date', 'ASC']],
			});

			return res.json(invoices);

		} catch (error) {
			console.error('Erro ao listar faturas:', error);
			return res.status(500).json({ error: 'Erro interno do servidor ao listar as faturas.' });
		}
	}
}

export default new InvoicesController();
