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
    // Control how dates are written/read; set DB_TZ to your local offset (e.g. -03:00)
    timezone: process.env.DB_TZ || 'Z',
    dialectOptions: {
      // Ensure MySQL connection handles timezone consistently
      timezone: process.env.DB_TZ || 'Z',
      // Return DATETIME as strings if you prefer to avoid implicit TZ shifts on read
      // dateStrings: true,
      // typeCast: true,
    },
    define: {
      underscored: false,
      freezeTableName: true,
      timestamps: true,
    },
  }
);

module.exports = { sequelize };


