const modelGetItems = require('../../util/sequelize/modelGetItems');

/**
 * Produces a plural resolver.
 *
 * @param {Model} Model Sequelize Model to create for
 * @param {Object} options Configurable options
 * @param {Function} options.findOptions Extra query args to pass to model find method.
 */
module.exports = (
  Model,
  {
    findOptions = () => ({}),
  } = {},
) => (
  /**
   * Resolves the query to a list of items.
   *
   * @param {Object} _root The current object being created.
   * @param {Object} args Arguments from the query/mutation.
   * @returns {Promise<{cursors: *, results: *}>}
   */
  async (_root, args) => ({
    results: await modelGetItems(args, Model, { retrieveArgs: findOptions(args) }),
    cursor: null,
  })
);
