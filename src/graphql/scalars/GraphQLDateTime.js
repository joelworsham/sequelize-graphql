const { GraphQLScalarType } = require('graphql');
const { GraphQLError } = require('graphql/error');
const { Kind } = require('graphql/language');
const moment = require('moment');

/**
 * GraphQL custom Scalar type: DateTime
 *
 * A datetime object representation, returned in the string format "MM/DD/YYYY 00:00:00:000"
 *
 * @see https://stackoverflow.com/a/41513681/2292329
 * @type {GraphQLScalarType}
 */
module.exports = new GraphQLScalarType({
  name: 'DateTime',
  description: 'A datetime object representation, returned in the string format "MM/DD/YYYY ' +
    '00:00:000"',

  /**
   * Serializes the Date type value into a String type value, for the client to receive.
   *
   * @param  {Date} value date value
   * @return {String} date as string
   */
  serialize(value) {
    if (!(value instanceof Date)) {
      throw new TypeError('Field error: value is not an instance of Date');
    }
    if (Number.isNaN(value.getTime())) {
      throw new TypeError('Field error: value is an invalid Date');
    }
    return moment(value).format('MM/DD/YYYY HH:mm:ss:SSS')
  },

  /**
   * Parse value into Date.
   *
   * This will parse a JSON interpreted variable. E.G.
   *
   * ```graphql
   * query ($dateTime: DateTime) {
   *   someOperator(someDateTime: $dateTime!) {
   *     date
   *   }
   * }
   * ```
   *
   * ```json
   * {
   *   "dateTime": "01/01/2000 00:00:00:000"
   * }
   * ```
   *
   * @param  {*} value serialized date value
   * @return {Date} date value
   */
  parseValue(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new TypeError('Field error: value is an invalid Date');
    }
    return date;
  },

  /**
   * Parse AST literal to date.
   *
   * This will parse a string literal from the raw parameter input queries. E.G.
   *
   * ```graphql
   * query {
   *   someOperator(someDateTime: DateTime!) {
   *     date
   *   }
   * }
   * ```
   *
   * @param  {Object} ast GraphQL AST (Abstract Syntax Tree)
   * @param  {String} ast.kind AST "Kind" identifier.
   * @param  {String} ast.value AST raw value.
   * @return {Date} Date value
   */
  parseLiteral({ kind, value }) {
    if (![Kind.STRING, Kind.INT].includes(kind)) {
      throw new GraphQLError(`Query error: Can only parse strings or integers to dates but got a: ${kind}`);
    }

    const result = new Date(value);

    if (Number.isNaN(result.getTime())) {
      throw new GraphQLError('Query error: Invalid date');
    }

    if (value !== result.toJSON()) {
      throw new GraphQLError(
        'Query error: Invalid date format, only accepts: YYYY-MM-DDTHH:MM:SS.SSSZ',
      );
    }

    return result;
  },
});
