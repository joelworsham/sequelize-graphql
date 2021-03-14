const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'PageInfo',
  description: 'Provides information to the client on the current "pagination" information.',
  fields: {
    hasNextPage: {
      type: GraphQLNonNull(GraphQLBoolean),
    },
    hasPreviousPage: {
      type: GraphQLNonNull(GraphQLBoolean),
    },
    startCursor: {
      type: GraphQLString,
    },
    endCursor: {
      type: GraphQLString,
    },
  },
});
