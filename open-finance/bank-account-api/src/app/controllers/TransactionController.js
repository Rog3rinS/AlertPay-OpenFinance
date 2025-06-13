import * as Yup from 'yup';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import Bank from '../models/Bank';
import User from '../models/User';
import { Op } from 'sequelize';

class TransactionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().oneOf(['depósito', 'saque']).required(),
      amount: Yup.number().required(),
      description: Yup.string().required(),
      date: Yup.date().required(),
      account_id: Yup.number().required(),
      status: Yup.string()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' });
    }

    const { account_id, amount, type, description, date, status = 'pendente' } = req.body;

    const account = await Account.findByPk(account_id);
    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    let newBalance = parseFloat(account.balance);

    if (type === 'depósito') {
      newBalance += parseFloat(amount);
    } else if (type === 'saque') {
      if (parseFloat(amount) > newBalance) {
        return res.status(400).json({ error: 'Saldo insuficiente para saque' });
      }
      newBalance -= parseFloat(amount);
    }

    const transaction = await Transaction.create({
      type,
      amount,
      description,
      date,
      account_id,
      status,
      balance_after: newBalance,
    });

    account.balance = newBalance;
    await account.save();

    return res.status(201).json(transaction);
  }

  async update(req, res) {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    if (transaction.status === 'concluído') {
      return res.status(400).json({ error: 'Transação já concluída' });
    }

    const account = await Account.findByPk(transaction.account_id);
    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    let newBalance = parseFloat(account.balance);

    if (transaction.type === 'depósito') {
      newBalance += parseFloat(transaction.amount);
    } else if (transaction.type === 'saque') {
      if (transaction.amount > newBalance) {
        return res.status(400).json({ error: 'Saldo insuficiente para confirmar o saque' });
      }
      newBalance -= parseFloat(transaction.amount);
    }

    transaction.status = 'concluído';
    transaction.balance_after = newBalance;
    await transaction.save();

    account.balance = newBalance;
    await account.save();

    return res.json({
      message: 'Transação atualizada com sucesso',
      status: transaction.status,
      saldo_total_na_conta: account.balance
    });
  }

}

export default new TransactionController();

