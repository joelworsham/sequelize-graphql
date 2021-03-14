const log = require('../../lib/log');

/**
 * Deletes an item from the database via a Sequelize Model.
 *
 * @param {String|Number} id The database ID of the item to delete.
 * @param {{}} Model The Sequelize Model to perform on.
 * @param {Object} config
 * @param {Boolean} config.shouldThrow
 * @returns {Promise<*>}
 */
module.exports = async (id, Model, { shouldThrow = true } = {}) => {
  try {
    log.debug(
      `Deleting ${Model.name} with id "${id}"...`,
      'sequelize',
    );

    await (await Model.findByPk(id)).destroy();
    log.debug(`${Model.name} deleted!`, 'sequelize');
    return id;
  } catch (error) {
    log.error(
      `Error deleting ${Model.name}.`,
      'sequelize',
      error,
      { shouldThrow },
    );
  }

  return null;
};
