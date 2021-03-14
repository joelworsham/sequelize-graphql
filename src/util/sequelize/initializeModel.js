/* eslint-disable no-param-reassign */
const withPagination = require('../../lib/sequelizeCursorPagination');

/**
 * Factory for model initialization.
 *
 * @param {Object} attributes Model attributes.
 * @param {Object} options Model options.
 * @param {String} description Model description.
 * @param {Boolean} paginate (Optional) Add cursor pagination.
 * @returns {*}
 */
module.exports = (
  attributes,
  options,
  {
    description,
    paginate = false,
  },
) => (
  /**
   * Initializes a Sequelize Model with some extra options.
   *
   * @param {{}} Model Sequelize Model to initiailize.
   * @returns {*}
   */
    (Model) => {
    Model.init(attributes, options);

    if (description) Model.description = description;

    if (paginate) {
      return withPagination(Model);
    }
    return Model;
  }
);
