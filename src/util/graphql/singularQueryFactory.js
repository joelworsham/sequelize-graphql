const { GraphQLInt, GraphQLNonNull } = require('graphql');
const singularResolver = require('../../graphql/resolvers/singularResolverFactory');

/**
 * Returns a single query object.
 *
 * @param {Model} Model Sequelize Model to create for
 * @param {GraphQLObjectType} Type Node to create for
 * @param {Function} findOptions Options to pass through to findByPk()
 * @param {Object} args Args to use/override.
 * @param {Boolean} idRequired
 * @returns {Object}
 */
module.exports = (
  Model,
  Type,
  {
    findOptions = () => null,
    args = {},
    idRequired = true,
  } = {},
) => ({
  type: Type,
  args: {
    id: {
      type: idRequired
        ? GraphQLNonNull(GraphQLInt)
        : GraphQLInt,
    },
    ...args,
  },
  resolve: singularResolver(Model, { findOptions }),
});
