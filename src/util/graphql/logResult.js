const log = require('@joelworsham/log');

module.exports = (
  Model,
  result,
  {
    queryType,
  } = {},
) => {
  log.inform(
    `Successful GraphQL ${queryType} query for ${Model.name}`,
    'graphql',
    { json: { result } },
  );
};
