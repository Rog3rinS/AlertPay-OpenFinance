import User from '../app/models/User.js';
import Account from '../app/models/Account.js';
import sequelize from '../database/index.js';
import { getDefaultBankCnpj } from '../config/initBank.js';

export async function createUserWithAccount(userData, bankCnpj) {
    const finalBankCnpj = bankCnpj || getDefaultBankCnpj();

    return await sequelize.transaction(async (transaction) => {
        const user = await User.create(userData, { transaction });

        const account = await Account.create({
            type: 'corrente',
            balance: 0.00,
            status: true,
            user_cpf: user.cpf,
            bank_cnpj: finalBankCnpj,
            created_at: new Date(),
            updated_at: new Date(),
        }, { transaction });

        return { user, account };
    });
}
