/**
 * Produces a paginated resolver.
 *
 * @param {Model} Model Sequelize Model to create for
 * @param {Object} options Configurable options
 * @param {String} options.whereArg Key of the "where" arg from the query args.
 * @param {Function} options.findMethod Method used to find results on the model.
 * @param {Function} options.findOptions Extra query args to pass to model find method.
 */
module.exports = (
  Model,
  {
    whereArg = undefined,
    findMethod = undefined,
    findOptions: extraQueryArgs = () => null,
  } = {},
) => (
  /**
   * Resolves the query to a list of items.
   *
   * @param {Object} _root The current object being created.
   * @param {Object} args Arguments from the query/mutation.
   * @param {Object} context HTTP context.
   * @param {Object} info GraphQL query information.
   * @returns {Promise<{cursors: *, results: *}>}
   */
  async (_root, args, context, info) => {
    const {
      first,
      last,
      after,
      before,
      order,
      orderBy,
      search,
      ...remainingWhere
    } = args;

    const extraArgs = extraQueryArgs(args);

    const queryArgs = {
      ...(extraArgs || {}),
      order,
      orderBy,
      search,
    };

    if (args[whereArg || Model.name.toLowerCase()]) {
      queryArgs.where = args[whereArg || Model.name.toLowerCase()];
    } else {
      // Only add where args that exist directly on the model. Assume all else is handled custom
      // in the findMethod()
      // eslint-disable-next-line no-restricted-syntax
      for (const whereProp in remainingWhere) {
        if (whereProp in Model.rawAttributes) {
          if (!queryArgs.where) queryArgs.where = {};
          queryArgs.where[whereProp] = remainingWhere[whereProp];
        }
      }

      // If "where" is customized in "extraArgs", merge in
      if (extraArgs && extraArgs.where) {
        queryArgs.where = {
          ...queryArgs.where,
          ...extraArgs.where,
        };
      }
    }

    // Add forwards OR backwards pagination args
    if (after) {
      queryArgs.limit = first;
      queryArgs.after = after;
    } else if (before) {
      queryArgs.limit = last;
      queryArgs.before = before;
    } else {
      queryArgs.limit = first || last || queryArgs.limit || 10;
    }

    const { results, cursors } = await Model.paginate(queryArgs, {
      // Allows for a specific or custom Model find method. E.G. Distillery.getWhiskeys()
      method: findMethod
        ? (paginateArgs) => (
          findMethod(paginateArgs, _root, args, context, info)
        )
        : undefined,
    });

    return {
      results,
      cursors: results ? cursors : null,
    };
  }
);
