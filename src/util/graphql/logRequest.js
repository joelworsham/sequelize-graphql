const log = require('@joelworsham/log');

module.exports = (
  Model,
  {
    queryType,
    state = {},
    options = {},
  } = {},
) => {
  log.inform(
    `Performing GraphQL ${queryType} query for ${Model.name}`,
    'graphql',
    { json: { state, options } },
  );
};
