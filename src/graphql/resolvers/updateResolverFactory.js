const modelUpdateItem = require('../../util/sequelize/modelUpdateItem');

/**
 * Resolver factory for "update".
 *
 * @param {{}} Model Sequelize Model to perform on.
 * @param {Object} config
 * @param {Object} config.retrieveArgs
 * @returns {function(*, *): Promise<*|undefined>}
 */
module.exports = (
  Model,
  {
    retrieveArgs = {},
  } = {},
) => (
  /**
   * Resolver for updating a Sequelize Model to the database.
   * @param _
   * @param args
   * @returns {Promise<*|undefined>}
   */
  async (_, args) => (
    modelUpdateItem(
      args[`${Model.name.charAt(0).toLowerCase()}${Model.name.substr(1)}`],
      Model,
      { retrieveArgs, shouldThrow: true },
    )
  )
);
