// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
module.exports = {
  development: {
    username: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
    host: process.env['DB_HOST'],
    port: parseInt(process.env['DB_PORT']),
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      bigNumberStrings: true,
      decimalNumbers: true,
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
  },
};
