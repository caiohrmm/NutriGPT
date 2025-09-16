const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { sequelize } = require('./sequelize');

const port = Number(process.env.PORT || 3000);

function requireEnv(name) {
  if (!process.env[name] || String(process.env[name]).length < 16) {
    // eslint-disable-next-line no-console
    console.error(`Missing or weak env var: ${name}`);
    process.exit(1);
  }
}

async function start() {
  try {
    // Security-critical envs
    requireEnv('JWT_ACCESS_SECRET');
    requireEnv('JWT_REFRESH_SECRET');

    await sequelize.authenticate();
    // Do not sync here; use migrations
    app.listen(port, '0.0.0.0', () => {
      // eslint-disable-next-line no-console
      console.log(`NutriGPT API listening on port ${port} (all interfaces)`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();


