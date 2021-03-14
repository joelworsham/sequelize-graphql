const log = require('../../lib/log');

/**
 * Updates an item in the database via a Sequelize Model.
 *
 * @param {Object} state The new state to merge into the item.
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
      `Updating ${Model.name} with id "${state.id}"...`,
      'sequelize',
      { json: state },
    );

    await Model.update(state, { where: { id: state.id } });

    log.debug(`${Model.name} updated!`, 'sequelize');

    // Potentially return with scope
    return retrieveArgs.scope
      ? await Model.scope(retrieveArgs.scope).findByPk(state.id, retrieveArgs)
      : await Model.findByPk(state.id, retrieveArgs);
  } catch (error) {
    log.error(
      `Error updating ${Model.name}.`,
      'sequelize',
      error,
      { shouldThrow },
    );
  }

  return null;
};
