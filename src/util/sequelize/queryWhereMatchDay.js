const Sequelize = require('sequelize');

module.exports = (date, column) => {
  date.setUTCHours(0, 0, 0, 0);
  return Sequelize.where(
    Sequelize.fn('date_trunc', 'day', Sequelize.col(column)),
    date,
  );
};
