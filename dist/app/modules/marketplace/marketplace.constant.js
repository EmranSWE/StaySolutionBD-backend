"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMarketplaceQueryOption = exports.marketplaceRelationalFieldsMapper = exports.marketplaceRelationalFields = exports.marketplaceSearchableFields = exports.marketplaceFilterableFields = void 0;
exports.marketplaceFilterableFields = [
    'searchTerm',
    'price',
    'category',
    'id',
    'ownerId',
];
exports.marketplaceSearchableFields = [
    'title',
    'itemDescription',
];
exports.marketplaceRelationalFields = ['ownerId'];
exports.marketplaceRelationalFieldsMapper = {
    ownerId: 'owner',
};
exports.IMarketplaceQueryOption = ['limit', 'page', 'sortBy', 'sortOrder'];
