import Sequelize, { Model } from 'sequelize';

class Transaction extends Model {
  static init(sequelize) {
    super.init(
      {
        type: Sequelize.STRING,
        amount: Sequelize.DECIMAL(10, 2),
        balance_after: Sequelize.DECIMAL(10, 2),
        status: {
          type: Sequelize.STRING,
          defaultValue: 'pendente', 
        },
        date: Sequelize.DATE,
        description: Sequelize.STRING,
        account_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Account, { foreignKey: 'account_id', as: 'account' });
  }
}

export default Transaction;
