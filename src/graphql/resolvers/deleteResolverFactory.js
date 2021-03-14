const modelDeleteItem = require('../../util/sequelize/modelDeleteItem');

/**
 * Resolver factory for "delete".
 *
 * @param {{}} Model Sequelize Model to perform on.
 * @returns {function(*, *): Promise<*|undefined>}
 */
module.exports = (Model) => (
  /**
   * Resolver for deleting a Sequelize Model from the database
   * @param _
   * @param args
   * @returns {Promise<*|undefined>}
   */
  async (_, args) => (
    modelDeleteItem(args.id, Model, { shouldThrow: true })
  )
);
