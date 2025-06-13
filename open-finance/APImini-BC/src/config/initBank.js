import { Error } from 'sequelize';
import Bank from '../app/models/Bank.js';

let defaultBankInstance = null;

export async function initDefaultBank() {
  const defaultBank = {
    cnpj: '12345679000100',
    name: 'Banco Central APImini',
    email: 'contato@APImini.com',
    phone: '55 3333-0002',
    address: 'Avenida dos Bancos, 1001',
  };

  const [bank, created] = await Bank.findOrCreate({
    where: { cnpj: defaultBank.cnpj },
    defaults: defaultBank,
  });

  defaultBankInstance = bank;

  if (created) {
    console.log('[InitBank] Banco criado com sucesso.');
  } else {
    console.log('[InitBank] Banco já existente, nada foi alterado.');
  };
}

export function getDefaultBankCnpj() {
  if (!defaultBankInstance) {
    throw new Error("Banco Ainda nao foi inicializado");
  }
  return defaultBankInstance.cnpj;
}
