/**
 * Encodes a pagination cursor from an ID using base64.
 *
 * From GraphQL documentation:
 *
 * > As a reminder that the cursors are opaque and that their format should not be relied upon, we
 * > suggest base64 encoding them.
 *
 * @see https://graphql.org/learn/pagination/#pagination-and-edges
 *
 * @param {Array} cursor Cursor array to encode (typically, [id])
 * @returns {String} Encoded cursor for the node.
 */
module.exports = (cursor) => (
  cursor !== undefined ? Buffer.from(JSON.stringify(cursor)).toString('base64') : null
);
