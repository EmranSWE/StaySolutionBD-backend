"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IIIssueQueryOption = exports.IIssueRelationalFieldsMapper = exports.IIssueRelationalFields = exports.IIssueSearchableFields = exports.IIssueFilterableFields = void 0;
exports.IIssueFilterableFields = [
    'searchTerm',
    'issueStatus',
    'priorityLevel',
    'id',
    'propertyId',
];
exports.IIssueSearchableFields = ['issueDescription'];
exports.IIssueRelationalFields = ['propertyId'];
exports.IIssueRelationalFieldsMapper = {
    propertyId: 'property',
};
exports.IIIssueQueryOption = ['limit', 'page', 'sortBy', 'sortOrder'];
