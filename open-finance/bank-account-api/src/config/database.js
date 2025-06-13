require('dotenv').config();

module.exports = {
    development: {
        dialect: process.env.DB_DIALECT || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'admin',
        database: process.env.DB_NAME || 'bank_account_db',
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true,
        },
    },
};
