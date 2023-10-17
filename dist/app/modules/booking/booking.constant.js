"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBookingQueryOption = exports.BookingRelationalFieldsMapper = exports.BookingRelationalFields = exports.BookingSearchableFields = exports.BookingFilterableFields = void 0;
exports.BookingFilterableFields = [
    'searchTerm',
    'bookingStatus',
    'propertyId',
    'bookingStartDate',
    'id',
];
exports.BookingSearchableFields = ['specialRequest'];
exports.BookingRelationalFields = ['propertyId'];
exports.BookingRelationalFieldsMapper = {
    propertyId: 'property',
};
exports.IBookingQueryOption = ['limit', 'page', 'sortBy', 'sortOrder'];
