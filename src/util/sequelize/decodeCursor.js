/**
 * Decodes a pagination cursor to an ID integer using base64.
 *
 * From GraphQL documentation:
 *
 * > As a reminder that the cursors are opaque and that their format should not be relied upon, we
 * > suggest base64 encoding them.
 *
 * @see https://graphql.org/learn/pagination/#pagination-and-edges
 *
 * @param {String} cursor The cursor to decode into an ID.
 * @returns {Number} Decoded node ID integer from the cursor.
 */
module.exports = (cursor) => (
  cursor
    ? JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'))
    : null
);
