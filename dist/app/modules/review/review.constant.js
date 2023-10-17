"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRelationalFieldsMapper = exports.reviewRelationalFields = exports.reviewSearchableFields = exports.reviewFilterableFields = void 0;
exports.reviewFilterableFields = ['searchTerm', 'id'];
exports.reviewSearchableFields = ['comments'];
exports.reviewRelationalFields = ['renterId', 'propertyId'];
exports.reviewRelationalFieldsMapper = {
    propertyId: 'propertyId',
};
