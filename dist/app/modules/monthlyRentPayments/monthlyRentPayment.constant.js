"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyRentPaymentQueryOption = exports.MonthlyRentPaymentRelationalFieldsMapper = exports.MonthlyRentPaymentRelationalFields = exports.MonthlyRentPaymentSearchableFields = exports.MonthlyRentPaymentFilterableFields = void 0;
exports.MonthlyRentPaymentFilterableFields = [
    'searchTerm',
    'year',
    'amount',
    'status',
];
exports.MonthlyRentPaymentSearchableFields = [
    'status',
    'year',
    'month',
    'amount',
];
exports.MonthlyRentPaymentRelationalFields = [
    'renterId',
    'propertyId',
];
exports.MonthlyRentPaymentRelationalFieldsMapper = {
    renterId: 'renter',
    propertyId: 'property',
};
exports.MonthlyRentPaymentQueryOption = [
    'limit',
    'page',
    'sortBy',
    'sortOrder',
];
