// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
module.exports = {
  development: {
    storage: './e-commerce.sqlite',
    dialect: 'sqlite',
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
