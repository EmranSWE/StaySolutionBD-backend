"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IWishlistQueryOption = exports.wishlistRelationalFieldsMapper = exports.wishlistRelationalFields = exports.wishlistSearchableFields = exports.wishlistFilterableFields = void 0;
exports.wishlistFilterableFields = ['searchTerm', 'propertyId'];
exports.wishlistSearchableFields = ['propertyId'];
exports.wishlistRelationalFields = ['ownerId', 'propertyId'];
exports.wishlistRelationalFieldsMapper = {
    propertyId: 'property',
};
exports.IWishlistQueryOption = ['limit', 'page', 'sortBy', 'sortOrder'];
