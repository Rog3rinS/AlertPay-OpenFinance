import Sequelize, { Model } from 'sequelize';

class Account extends Model {
  static init(sequelize) {
    super.init(
      {
        type: Sequelize.STRING,
        balance: {
          type: Sequelize.DECIMAL(10, 2),
          defaultValue: 0.00,
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        user_cpf: Sequelize.STRING,
        bank_cnpj: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_cpf', as: 'user' });
    this.belongsTo(models.Bank, { foreignKey: 'bank_cnpj', as: 'bank' });
    this.hasMany(models.Transaction, { foreignKey: 'account_id', as: 'transaction' });
  }
}

export default Account;
