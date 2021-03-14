const modelGetItem = require('../../util/sequelize/modelGetItem');
const modelFindItem = require('../../util/sequelize/modelFindItem');

/**
 * Produces a singular resolver.
 *
 * @param {Model} Model Sequelize Model to create for
 * @param {Object} options Configurable options
 * @param {Function} options.findOptions Extra query args to pass to model find method.
 */
module.exports = (
  Model,
  {
    findOptions = () => null,
  } = {},
) => (
  /**
   * Resolves the query to a list of items.
   *
   * @param {Object} _root The current object being created.
   * @param {Object} args
   * @param {String, Number} args.id
   * @returns {Promise<{cursors: *, results: *}>}
   */
  async (_root, { id, ...whereArgs }) => (
    id
      ? modelGetItem(id, Model, { retrieveArgs: findOptions(id) || {} })
      : modelFindItem(whereArgs, Model, { retrieveArgs: findOptions(id) || {} })
  )
);
