const { GraphQLInputObjectType } = require('graphql');
const getTypeConfigFromDbModel = require('./getTypeConfigFromDbModel');

module.exports = (
  Model,
  name,
  {
    description,
    exclude = ['id', 'createdAt', 'updatedAt'],
    require,
  } = {},
) => (
  new GraphQLInputObjectType(
    getTypeConfigFromDbModel(Model, { name, description, exclude, require }),
  )
);
