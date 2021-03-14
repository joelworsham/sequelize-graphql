const log = require('../../lib/log');

/**
 * Creates an item in the database via a Sequelize Model.
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
      `Creating ${Model.name}...`,
      'sequelize',
      { json: state },
    );

    if (state === null) {
      log.debug('Empty state provided. Nothing to create.', 'sequelize');

      return null;
    }

    const createdItem = await Model.create(state);

    log.debug(`${Model.name} created!`, 'sequelize');

    // Potentially return with scope
    return retrieveArgs.scope
      ? await Model.scope(retrieveArgs.scope).findByPk(createdItem.id, retrieveArgs)
      : await Model.findByPk(createdItem.id, retrieveArgs);
  } catch (error) {
    log.error(
      `Error creating ${Model.name}.`,
      'sequelize',
      error,
      { shouldThrow },
    );
  }

  return null;
};
