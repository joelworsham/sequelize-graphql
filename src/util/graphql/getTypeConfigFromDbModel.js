const createArgsFromDbModel = require('./createArgsFromDbModel');

/**
 * Generates a GraphQL Type config from a Sequelize Model.
 *
 * @param {Model} Model Sequelize Model to use.
 * @param {Object} options? Configurable options
 * @param {Object} options.fields Extra fields to merge in.
 * @param {String} options.name Type name. Will inherit Model.name otherwise.
 * @param {String} options.description Type description. Will inherit Model.description otherwise.
 * @param {Array} options.exclude Model attributes to exclude from the type fields.
 * @param {Array} options.require If set, will not automatically use `attribute.allowNull`, but
 *                                will set to non-null if included in require array
 * @returns {Function}
 */
module.exports = (
  Model,
  {
    name = undefined,
    description = undefined,
    fields = {},
    exclude = [],
    require = undefined,
  } = {},
) => ({
  name: name || Model.name,
  description: description || Model.description,
  fields: createArgsFromDbModel(
    Model,
    {
      fields,
      exclude,
      require,
    },
  ),
});
