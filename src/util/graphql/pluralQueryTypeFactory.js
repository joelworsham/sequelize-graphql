const { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString } = require('graphql');
const encodeCursor = require('../sequelize/encodeCursor');
const PageInfo = require('../../graphql/types/PageInfo');

/**
 * Creates a GraphQL Connection Type for a specified Model and Type.
 *
 * @param {Model} Model Sequelize Model to create for
 * @param {GraphQLObjectType} NodeType Node to create for
 * @param {Object} options Configurable options.
 * @param {String} options.name Name to use instead of the Model.name
 * @param {Object} options.nodeFields Extra fields to put on the edge.
 * @param {String} options.nodesName Name identifier for the "nodes" wrapper.
 * @returns {GraphQLObjectType<any, any>}
 */
module.exports = (
  Model,
  NodeType,
  {
    name = undefined,
    nodeFields = {},
    nodesName = 'nodes',
  } = {},
) => (
  new GraphQLObjectType({
    name: `${name || `${Model.name}Query`}`,
    description: `Connects to the ${Model.tableName} table from the database`,
    fields: {
      pageInfo: {
        type: GraphQLNonNull(PageInfo),
        resolve: async (
          {
            cursors: {
              after: endCursor,
              before: startCursor,
              hasNext,
              hasPrevious,
            },
          },
        ) => (
          {
            endCursor,
            startCursor,
            hasNext,
            hasPrevious,
          }
        ),
      },
      [nodesName]: {
        type: GraphQLList(
          new GraphQLObjectType({
            name: `${name || Model.name}Node`,
            description: `Node for providing a ${name || Model.name} Node, with cursor information
            , in a ${name || Model.name} Connection`,
            fields: {
              cursor: {
                type: GraphQLNonNull(GraphQLString),
              },
              node: {
                type: GraphQLNonNull(NodeType),
                resolve: ({ node }) => node,
              },
              ...nodeFields,
            },
          }),
        ),
        resolve: ({ results }) => (
          results.map((resultItem) => ({
            cursor: encodeCursor([resultItem.id]),
            node: resultItem,
          }))
        ),
      },
    },
  })
);
