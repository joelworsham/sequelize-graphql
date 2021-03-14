const getPaginateArgs = require('./getPaginateArgs');
const paginateResults = require('./paginateResults');

module.exports = (Model) => (
  /**
   * Query the database and paginate the results by means of cursor pagination.
   *
   * @param {Object} args Fetch args to pass through.
   * @param method
   * @returns {Promise<{cursors: {
   *            before: null, hasPrevious: (boolean|boolean), hasNext: boolean, after: null
   *          }, results: ({length}|*)}|null>}
   */
  async (
    args,
    {
      method = (_args) => Model.findAll(_args),
    } = {},
  ) => {
    // Build proper fetch args for cursor pagination
    const fetchArgs = getPaginateArgs(args);

    // Get results from sequelize method
    const results = await method(fetchArgs);

    // Paginate the results
    return paginateResults(results, {
      limit: args.limit,
      before: args.before,
      after: args.after,
    });
  }
);
