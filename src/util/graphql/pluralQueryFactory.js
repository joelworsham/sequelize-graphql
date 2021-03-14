const { GraphQLString } = require('graphql');
const paginateResolver = require('../../graphql/resolvers/paginateResolverFactory');
const pluralResolver = require('../../graphql/resolvers/pluralResolverFactory');
const pluralQueryTypeFactory = require('./pluralQueryTypeFactory');
const decorateArgsWithPagination = require('./decorateArgsWithPagination');

/**
 * Creates a plural query connection.
 *
 * @param {Model} Model Sequelize Model to create for
 * @param {GraphQLObjectType} Type to create for
 * @param {GraphQLInputObjectType} QueryInput Input args object.
 * @param {Object} options? Configurable options
 * @param {String} options.name Optional name to use instead of the Model.name
 * @param {Object} options.args Optional args to pass through
 * @param {String} options.whereArg Key of the "where" arg from the query args.
 * @param {Object} options.nodeFields Extra fields to put on the node wrapper.
 * @param {Function} options.findMethod Method used to find results on the model.
 * @param {Function} options.findOptions Extra query args to pass to model find method.
 * @param {Boolean} options.isConnection Defines whether this is or is not a connection.
 * @param {Function} options.resolver Optional resolver to use.
 * @returns {{args: *, resolve: (function(Object, Object): {
 *            cursors: *, results: *
 *          }), type: GraphQLObjectType<any, any>}}
 */
module.exports = (
  Model,
  Type,
  QueryInput = undefined,
  {
    name = undefined,
    args: extraArgs = {},
    whereArg = undefined,
    nodeFields = {},
    findMethod = undefined,
    findOptions = () => null,
    isConnection = false,
    resolver = undefined,
  } = {},
) => {
  const args = {
    order: { type: GraphQLString },
    orderBy: { type: GraphQLString },
    filter: { type: GraphQLString },
    filterBy: { type: GraphQLString },
    search: { type: GraphQLString },
    ...extraArgs,
  };

  return {
    type: pluralQueryTypeFactory(
      Model,
      Type,
      {
        name,
        nodeFields,
        nodesName: isConnection ? 'edges' : 'nodes',
      },
    ),
    args: decorateArgsWithPagination(
      QueryInput !== undefined
        ? {
          [Model.name.toLowerCase()]: {
            type: QueryInput,
          },
          ...args,
        }
        : args,
    ),
    resolve: async (...resolverArgs) => {
      if (resolver) return resolver(...resolverArgs);
      if (Model.hasPagination) {
        return paginateResolver(
          Model,
          {
            whereArg,
            findMethod,
            findOptions,
          },
        )(...resolverArgs);
      }
      return pluralResolver(
        Model,
        {
          whereArg,
          findOptions,
        },
      )(...resolverArgs);
    },
  };
};
