const log = require('@joelworsham/log');

/**
 * Updates an item in the database via a Sequelize Model.
 *
 * @param {Object} state The state to search by
 * @param {{}} Model The Sequelize Model to perform on.
 * @param {Object} config
 * @param {Object} config.retrieveArgs
 * @param {Boolean} config.shouldThrow
 * @returns {Promise<{}|null>}
 */
module.exports = async (
  state,
  Model,
  {
    retrieveArgs = {},
    shouldThrow = true,
  } = {},
) => {
  try {
    log.debug(
      `Getting ${Model.name} with state:...`,
      'sequelize',
      { json: state },
    );

    const result = await Model.scope(retrieveArgs.scope || 'defaultScope').findOne(
      { where: state },
      retrieveArgs,
    );

    log.debug(
      `${Model.name} retrieved!`,
      'sequelize',
      { json: result },
    );

    return result;
  } catch (error) {
    log.error(
      `Error getting ${Model.name}.`,
      'sequelize',
      error,
      { shouldThrow },
    );
  }

  return null;
};
