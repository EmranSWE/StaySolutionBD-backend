"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISafetyQueryOption = exports.SafetyRelationalFieldsMapper = exports.SafetyRelationalFields = exports.SafetySearchableFields = exports.SafetyFilterableFields = void 0;
exports.SafetyFilterableFields = [
    'searchTerm',
    'id',
    'propertyId',
    'safetyScore',
];
exports.SafetySearchableFields = ['safetyAmenities'];
exports.SafetyRelationalFields = ['propertyId'];
exports.SafetyRelationalFieldsMapper = {
    propertyId: 'property',
};
exports.ISafetyQueryOption = ['limit', 'page', 'sortBy', 'sortOrder'];
