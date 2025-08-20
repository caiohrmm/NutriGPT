require('dotenv').config();

const common = {
  dialect: process.env.DB_DIALECT || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  database: process.env.DB_NAME || 'nutrigpt',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  logging: false,
  define: {
    underscored: false,
    freezeTableName: true,
    timestamps: true,
  },
};

module.exports = {
  development: { ...common },
  test: { ...common, database: `${common.database}_test` },
  production: { ...common },
};


