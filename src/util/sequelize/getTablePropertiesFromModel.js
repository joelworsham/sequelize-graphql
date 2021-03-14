module.exports = (Model) => ({
  tableName: Model.tableName,
  attributes: Model.rawAttributes,
});
