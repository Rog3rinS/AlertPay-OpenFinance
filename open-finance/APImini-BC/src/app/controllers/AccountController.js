import * as Yup from 'yup';
import Account from '../models/Account.js';
import Bank from '../models/Bank.js';
import User from '../models/User.js';

class AccountController {

  async store(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required('Tipo da conta é obrigatório'),
      balance: Yup.number().required('Saldo inicial é obrigatório'),
      bank_cnpj: Yup.string().required('CNPJ do banco é obrigatório'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' });
    }

    const { bank_cnpj, type, balance } = req.body;
    const user_cpf = req.userCpf;

    const bank = await Bank.findByPk(bank_cnpj);
    const user = await User.findByPk(user_cpf);

    if (!bank) {
      return res.status(404).json({ error: 'Banco não encontrado' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const account = await Account.create({
      type,
      balance,
      bank_cnpj,
      user_cpf,
    });

    return res.status(201).json(account);
  }


  async index(req, res) {
    const user_cpf = req.userCpf;

    const accounts = await Account.findAll({
      where: { user_cpf },
      include: [
        {
          model: Bank,
          as: 'bank',
          attributes: ['name', 'cnpj'],
        },
      ],
    });

    return res.json(accounts);
  }


  async update(req, res) {
    const { id } = req.params;
    const user_cpf = req.userCpf;

    const schema = Yup.object().shape({
      type: Yup.string(),
      balance: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados' });
    }

    const account = await Account.findOne({ where: { id, user_cpf } });

    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    await account.update(req.body);

    return res.json(account);
  }


  async delete(req, res) {
    const { id } = req.params;
    const user_cpf = req.userCpf;

    const account = await Account.findOne({ where: { id, user_cpf } });

    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    await account.destroy();

    return res.status(204).send();
  }
}

export default new AccountController();
