const encodeCursor = require('../../util/sequelize/encodeCursor');

/**
 * Paginates a set of results from the database.
 *
 * @param {Array} results Results data.
 * @param {Object} paginateArgs Pagination args.
 * @param {Number} paginateArgs.limit Number of items to limit retrieval to.
 * @param {String} paginateArgs.before Before cursor.
 * @param {String} paginateArgs.after After cursor.
 * @returns {{cursors: {
 *            before: null, hasPrevious: (boolean|boolean), hasNext: boolean, after: null
 *          }, results: *}}
 */
module.exports = (
  results,
  {
    limit,
    before,
    after,
  },
) => {
  const hasMore = results.length > limit;

  if (hasMore) {
    results.pop();
  }

  if (before) {
    results.reverse();
  }

  const hasNext = !!before || hasMore;
  const hasPrevious = !!after || (!!before && hasMore);

  let beforeCursor = null;
  let afterCursor = null;

  if (results.length > 0) {
    beforeCursor = encodeCursor([results[0].id]);
    afterCursor = encodeCursor([results[results.length - 1].id]);
  }

  return {
    results,
    cursors: {
      hasNext,
      hasPrevious,
      before: beforeCursor,
      after: afterCursor,
    },
  };
};
