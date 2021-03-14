const { GraphQLInt, GraphQLString } = require('graphql');

/**
 * Potentially decorates GraphQL args with pagination arguments.
 *
 * @param {Object} args GraphQL query args.
 * @returns {Object}
 */
module.exports = (args) => ({
  ...args,
  first: {
    type: GraphQLInt,
    description: 'Number of items to retrieve, after provided cursor.',
  },
  last: {
    type: GraphQLInt,
    description: 'Number of items to retrieve, before provided cursor.',
  },
  after: {
    type: GraphQLString,
    description: 'Cursor indicating the item after which you want to retrieve results.',
  },
  before: {
    type: GraphQLString,
    description: 'Cursor indicating the item before which you want to retrieve results.',
  },
});
