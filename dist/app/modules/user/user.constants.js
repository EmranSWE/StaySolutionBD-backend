"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IReviewQueryOption = exports.userRelationalFieldsMapper = exports.userRelationalFields = exports.userSearchableFields = exports.userFilterableFields = void 0;
exports.userFilterableFields = ['searchTerm', 'id', 'propertyId'];
exports.userSearchableFields = [
    'email',
    'phone',
    'firstName',
    'middleName',
    'lastName',
];
exports.userRelationalFields = ['propertyId'];
exports.userRelationalFieldsMapper = {
    propertyId: 'propertyId',
};
exports.IReviewQueryOption = ['limit', 'page', 'sortBy', 'sortOrder'];
