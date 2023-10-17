"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPropertyQueryOption = exports.propertyRelationalFieldsMapper = exports.propertyRelationalFields = exports.propertySearchableFields = exports.propertyFilterableFields = void 0;
exports.propertyFilterableFields = [
    'searchTerm',
    'numberOfRooms',
    'monthlyRent',
    'availableAfter',
    'id',
    'ownerId',
    'insuranceId',
];
exports.propertySearchableFields = ['city', 'description'];
exports.propertyRelationalFields = ['ownerId', 'insuranceId'];
exports.propertyRelationalFieldsMapper = {
    ownerId: 'owner',
    insuranceId: 'insurance',
};
exports.IPropertyQueryOption = ['limit', 'page', 'sortBy', 'sortOrder'];
