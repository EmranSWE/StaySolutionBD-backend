'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ImarketplaceQueryOption =
  exports.marketplaceRelationalFieldsMapper =
  exports.marketplaceRelationalFields =
  exports.marketplaceSearchableFields =
  exports.marketplaceFilterableFields =
    void 0
exports.marketplaceFilterableFields = [
  'searchTerm',
  'price',
  'category',
  'id',
  'ownerId',
]
exports.marketplaceSearchableFields = ['itemDescription']
exports.marketplaceRelationalFields = ['ownerId']
exports.marketplaceRelationalFieldsMapper = {
  ownerId: 'owner',
}
exports.ImarketplaceQueryOption = ['limit', 'page', 'sortBy', 'sortOrder']
