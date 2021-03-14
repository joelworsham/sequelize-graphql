const { GraphQLInt, GraphQLString } = require('graphql');

/**
 * Potentially decorates GraphQL args with pagination forwards/backwards arguments.
 *
 * @param {String} pagination Pagination direction, if desired ["forwards" or "backwards"].
 * @returns {function(*): *}
 */
module.exports = (pagination) => (
  /**
   * Potentially decorates GraphQL args with pagination forwards/backwards arguments.
   *
   * @param {Object} args GraphQL query args.
   * @returns {Object}
   */
  (args) => ({
    ...args,
    // Optionally add forwards pagination
    ...(
      pagination === 'forwards'
        ? {
          first: {
            type: GraphQLInt,
            description: 'Number of items to retrieve, after provided cursor.',
          },
          after: {
            type: GraphQLString,
            description: 'Cursor indicating the item after which you want to retrieve results.',
          },
        }
        : {}
    ),
    // Optionally add backwards pagination
    ...(
      pagination === 'backwards'
        ? {
          last: {
            type: GraphQLInt,
            description: 'Number of items to retrieve, before provided cursor.',
          },
          before: {
            type: GraphQLString,
            description: 'Cursor indicating the item before which you want to retrieve results.',
          },
        }
        : {}
    ),
  })
);
