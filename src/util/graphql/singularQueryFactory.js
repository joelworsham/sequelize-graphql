const { GraphQLInt } = require('graphql');

/**
 * Returns a single query object.
 *
 * @param {Model} Model Sequelize Model to create for
 * @param {GraphQLObjectType} Type Node to create for
 * @param {Function} noneFoundMessage Generates the error message. Is passed the item ID as the
 *                                    param.
 * @returns {Object}
 */
module.exports = (
  Model,
  Type,
  {
    noneFoundMessage = (id) => `No exists with the id: ${id}`,
  } = {},
) => ({
  type: Type,
  args: {
    id: { type: GraphQLInt },
  },
  resolve: async (_, { id }) => {
    const item = await Model.findByPk(id);

    if (!item) {
      throw new Error(noneFoundMessage(id));
    }

    return item;
  },
});
