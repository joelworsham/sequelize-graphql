const paginate = require('./paginate');

module.exports = (Model) => {
  // eslint-disable-next-line no-param-reassign
  Model.paginate = paginate(Model);
  // eslint-disable-next-line no-param-reassign
  Model.hasPagination = true;
  return Model;
};
