const { hash, genSalt } = require('bcrypt');

/**
 * Encrypts a field securely using bcrypt.
 *
 * @see https://codahale.com/how-to-safely-store-a-password/
 *
 * @param {String} value The value to encrypt.
 * @param {Object} options Configurable options.
 * @param {Number} options.rounds The number of salt rounds to use. Default is 10.
 * @returns {Promise<unknown>}
 */
module.exports = async (
  value,
  {
    rounds = 10,
  } = {},
) => (
  hash(
    value,
    await genSalt(rounds),
  )
);
