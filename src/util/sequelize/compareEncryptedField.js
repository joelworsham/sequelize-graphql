const { compare } = require('bcrypt');
const log = require('../../lib/log');

/**
 * Encrypts a field securely using bcrypt.
 *
 * @see https://codahale.com/how-to-safely-store-a-password/
 *
 * @param {String} value The value to validate in the comparison.
 * @param {String} encrypted The encrypted value to compare against.
 * @returns {Promise<unknown>}
 */
module.exports = async (value, encrypted) => (
  new Promise((resolve, reject) => (
    compare(value, encrypted, (error, matched) => {
      if (error) {
        log.error(
          'Error in comparing encrypted value.',
          'sequelize',
          error,
          { json: { value, encrypted } },
        );
      }

      if (matched) {
        resolve(true);
      } else {
        reject(error);
      }
    })
  ))
);
