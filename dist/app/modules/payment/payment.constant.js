"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPaymentQueryOption = exports.paymentRelationalFieldsMapper = exports.paymentRelationalFields = exports.paymentSearchableFields = exports.paymentFilterableFields = void 0;
exports.paymentFilterableFields = [
    'searchTerm',
    'paymentStatus',
    'paymentAmount',
    'bookingId',
    'id',
    'renterId',
];
exports.paymentSearchableFields = ['paymentMethod'];
exports.paymentRelationalFields = ['renterId', 'bookingId'];
exports.paymentRelationalFieldsMapper = {
    renterId: 'renter',
    bookingId: 'booking',
};
exports.IPaymentQueryOption = ['limit', 'page', 'sortBy', 'sortOrder'];
