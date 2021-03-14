const { Sequelize } = require('sequelize');

const defaultAttributes = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
};

/**
 * Model attributes
 *
 * @docs https://sequelize.org/v5/manual/data-types.html
 *
 * @param {Array} exclude List of keys to exclude.
 */
module.exports = (
  {
    exclude = undefined,
  } = {},
) => (
  Object.keys(defaultAttributes).reduce(
    (attributes, attrKey) => (
      exclude && exclude.includes(attrKey) ? (
        attributes
      ) : ({
        ...attributes,
        [attrKey]: { ...defaultAttributes[attrKey] },
      })
    ),
    {},
  )
);
