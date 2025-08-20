const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'nutrigpt',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    // Control how dates are written; use MySQL-compatible offsets like '+00:00' or '-03:00'
    timezone: process.env.DB_TZ || '+00:00',
    define: {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
    },
  }
);

module.exports = { sequelize };


