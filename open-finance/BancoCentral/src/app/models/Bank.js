import Sequelize, { Model } from 'sequelize';

class Bank extends Model {
  static init(sequelize) {
    super.init(
      {
        cnpj: {
          type: Sequelize.STRING,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
        address: Sequelize.STRING,
        status: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Account, { foreignKey: 'bank_cnpj', as: 'account' });
  }
}

export default Bank;
