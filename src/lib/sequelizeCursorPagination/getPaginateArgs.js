const { Op } = require('sequelize');
const decodeCursor = require('../../util/sequelize/decodeCursor');

module.exports = (
  {
    order: extraOrder,
    where = {},
    attributes = [],
    include = [],
    limit,
    before,
    after,
    desc = false,
    raw = false,
    paranoid = true,
    nest = false,
    mapToModel = false,
    subQuery,
    ...queryArgs
  } = {},
) => {
  const decodedBefore = before ? decodeCursor(before) : null;
  const decodedAfter = after ? decodeCursor(after) : null;
  const cursorOrderIsDesc = before ? !desc : desc;
  const cursorOrderOperator = cursorOrderIsDesc ? Op.lt : Op.gt;

  let paginationQuery;

  if (before) {
    paginationQuery = {
      id: {
        [cursorOrderOperator]: decodedBefore[0],
      },
    };
  } else if (after) {
    paginationQuery = {
      id: {
        [cursorOrderOperator]: decodedAfter[0],
      },
    };
  }

  const whereQuery = paginationQuery
    ? { [Op.and]: [paginationQuery, where] }
    : where;

  const order = [
    ...(extraOrder ? [extraOrder] : []),
    cursorOrderIsDesc ? ['id', 'DESC'] : 'id',
  ];

  return {
    where: whereQuery,
    include,
    ...(limit && { limit: limit + 1 }),
    order,
    ...(Array.isArray(attributes) && attributes.length
      ? { attributes }
      : {}),
    raw,
    paranoid,
    nest,
    mapToModel,
    ...(typeof subQuery === 'boolean' && { subQuery }),
    ...queryArgs,
  };
};
