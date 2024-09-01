'use strict';
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, SALT_OR_ROUNDS } = process.env;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      await queryInterface.bulkInsert('Admins', [
        {
          name: 'rootadmin',
          password: await bcrypt.hash(
            SUPER_ADMIN_PASSWORD,
            parseInt(SALT_OR_ROUNDS),
          ),
          email: SUPER_ADMIN_EMAIL,
          roles: ['Super Admin', 'Admin'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } catch (e) {
      console.error(e);
    }
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Admins', null, {});
  },
};
