const { GraphQLNonNull, GraphQLList, GraphQLObjectType } = require('graphql');
const decorateArgsWithPagination = require('./decorateArgsWithPagination');
const getTypeFromSequelizeAttribute = require('./getTypeFromSequelizeAttribute');

/**
 * Generates GraphQL arguments for the query, from a Sequelize Model.
 *
 * @param {Model} Model Sequelize Model to create Type from.
 * @param {Object} options? Configurable options
 * @param {Array} options.associationDepthMap Array of current depth of associations, used to
 *                                            detect and prevent recursion.
 * @param {Array} options.exclude Model attributes to exclude from the argument object.
 * @param {Object} options.fields Extra fields to merge in.
 * @param {Boolean} options.isInput Set "true" if this Type is "Input" type.
 * @param {String} options.name Type name. Will inherit Model.name otherwise.
 * @param {String} options.pagination Pagination direction, if desired ["forwards" or "backwards"].
 * @param {Array} options.require Array of required argument keys.
 * @returns {Object}
 */
const createArgsFromDbModel = (
  Model,
  {
    associationDepthMap = [],
    exclude = ['createdAt', 'updatedAt', 'id'],
    fields: extraFields = {},
    isInput = false,
    name,
    pagination = 'forwards',
    require = undefined,
  } = {},
) => {
  // Initialize association depth map
  if (associationDepthMap.length === 0) {
    // eslint-disable-next-line no-param-reassign
    associationDepthMap = [{
      modelName: name || Model.name,
      associationDeepName: name || Model.name,
    }];
  }

  return decorateArgsWithPagination(isInput ? pagination : 'none')(
    {
      // Raw Attributes
      ...Object.entries(Model.rawAttributes).reduce(
        (fields, [key, attribute]) => {
          // Excluded
          if (exclude.includes(key)) return fields;

          // Get "matching" GraphQL type for the Sequelize type
          let type = getTypeFromSequelizeAttribute(key, attribute);

          // If can't get, don't add
          if (!type) return fields;

          if (require !== undefined) {
            // If required, wrap in GraphQLNonNull type
            if (require.includes(key)) type = GraphQLNonNull(type);
          } else {
            // If non-nullable, wrap in GraphQLNonNull type
            type = attribute.allowNull === false ? GraphQLNonNull(type) : type;
          }

          return {
            ...fields,
            [key]: {
              type,
            },
          };
        },
        extraFields,
      ),
      // Associations
      ...(
        !isInput
          ? Object.keys(Model.associations || []).reduce((associations, associationName) => {
            const association = Model.associations[associationName];
            const associatedModel = association.target;
            const lastAssociation = associationDepthMap[associationDepthMap.length - 1];
            const associationDeepName = `${lastAssociation.associationDeepName}${associationName}`;
            const alreadyAssociated = associationDepthMap.some((associationDepthItem) => (
              associationDepthItem.modelName === associatedModel.name
            ));

            // Recursion in associations, stop going deeper
            if (alreadyAssociated) return associations;

            const associationType = new GraphQLObjectType({
              name: associationDeepName,
              description: associatedModel.description,
              fields: createArgsFromDbModel(
                associatedModel,
                {
                  associationDepthMap: [
                    ...associationDepthMap,
                    {
                      modelName: associatedModel.name,
                      associationDeepName,
                    },
                  ],
                  fields: extraFields,
                  exclude,
                  require,
                  pagination,
                },
              ),
            });

            // Return new association of object type
            return {
              ...associations,
              [associationName]: {
                type: association.isMultiAssociation
                  ? GraphQLList(associationType)
                  : associationType,
              },
            };
          }, {})
          : {}
      ),
    },
  );
};

module.exports = createArgsFromDbModel;
