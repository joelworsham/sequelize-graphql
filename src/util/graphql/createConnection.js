const createPluralQuery = require('./pluralQueryFactory');

/**
 * Creates a GraphQL Connection Type for a specified Model and Type.
 *
 * @param {Model} Model Sequelize Model to create for
 * @param {GraphQLObjectType} NodeType Node to create for
 * @param {GraphQLInputObjectType} NodeInputType Input args object.
 * @param {Object} options Configurable options.
 * @param {String} options.name Name to use instead of the Model.name
 * @param {Object} options.edgeFields Extra fields to put on the edge.
 * @param {Function} findMethod Method used to find results on the model.
 * @returns {GraphQLObjectType<any, any>}
 */
module.exports = (
  Model,
  NodeType,
  NodeInputType = undefined,
  {
    name = undefined,
    edgeFields = {},
    findMethod = undefined,
  } = {},
) => (
  createPluralQuery(
    Model,
    NodeType,
    NodeInputType,
    {
      name,
      findMethod,
      nodeFields: edgeFields,
      isConnection: true,
    },
  )
);
