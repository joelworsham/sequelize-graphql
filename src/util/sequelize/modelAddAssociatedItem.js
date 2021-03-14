/* eslint-disable no-underscore-dangle */
const log = require('../../lib/log');

module.exports = async (parent, associatedItem, association) => {
  const parentModelName = parent._modelOptions.name.singular;
  try {
    log.debug(
      `Adding ${parentModelName} associated ${association} with id "${associatedItem.id}"...`,
      'sequelize',
    );

    await parent[`add${association}`](associatedItem);

    log.debug(`${parentModelName} associated ${association} added!`, 'sequelize');

    return associatedItem.id;
  } catch (error) {
    log.error(
      `Error adding ${parentModelName} associated ${association}.`,
      'sequelize',
      error,
      { shouldThrow: true }, // Alert GraphQL response of error
    );
    return null;
  }
};
