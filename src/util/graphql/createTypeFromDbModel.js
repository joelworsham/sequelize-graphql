const createArgsFromDbModel = require('./createArgsFromDbModel');

/**
 * Generates a GraphQL Type config from a Sequelize Model.
 *
 * @param {Type} Type GraphQL Type to use.
 * @param {Object} options? Configurable options
 * @param {String} options.description Type description. Will inherit Model.description otherwise.
 * @param {Array} options.exclude Model attributes to exclude from the type fields.
 * @param {Object} options.fields Extra fields to merge in.
 * @param {Boolean} options.isInput Set "true" if this Type is "Input" type.
 * @param {String} options.name Type name. Will inherit Model.name otherwise.
 * @param {String} options.pagination Pagination direction, if desired ["forwards" or "backwards"].
 * @param {Array} options.require If set, will not automatically use `attribute.allowNull`, but
 *                                will set to non-null if included in require array
 * @returns {GraphQLObjectType|*}
 */
const createTypeFromDbModel = (
  Type,
  {
    description = undefined,
    exclude = [],
    fields = {},
    isInput = false,
    name = undefined,
    pagination = 'forwards',
    require = undefined,
  } = {},
) => (
  (Model) => (
    new Type({
      name: name || Model.name,
      description: description || Model.description,
      fields: createArgsFromDbModel(
        Model,
        {
          exclude,
          fields,
          isInput,
          name,
          pagination,
          require,
        },
      ),
    })
  )
);

module.exports = createTypeFromDbModel;
