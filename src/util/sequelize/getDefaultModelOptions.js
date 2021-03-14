const sequelize = require('../../services/sequelize');

/*
 * Model options
 * @docs https://sequelize.org/v5/manual/getting-started.html#changing-the-default-model-options
 */
module.exports = () => ({
  sequelize,
});
