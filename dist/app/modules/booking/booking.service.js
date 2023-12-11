"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const utils_1 = require("../../utils/utils");
const booking_constant_1 = require("./booking.constant");
const addBooking = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = payload;
    // Authorization check: Ensure user has the 'owner' role
    const { role } = user;
    if (role !== 'renter') {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    if (body.bookingEndDate && body.bookingEndDate < body.bookingStartDate) {
        return {
            success: false,
            error: 'Booking end date cannot be set before the booking start date',
        };
    }
    if (!body.bookingEndDate) {
        const startDate = new Date(body.bookingStartDate);
        startDate.setMonth(startDate.getMonth() + 12);
        body.bookingEndDate = startDate;
    }
    // Prepare Booking data with the uploaded image URL
    const updatedData = Object.assign(Object.assign({}, body), { renterId: user.id });
    // Create a new Booking record in the database using Prisma
    const result = yield prisma_1.default.booking.create({
        data: updatedData,
    });
    // Return the created Booking data
    return { success: true, data: result };
});
const getBookings = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, bookingStatus, bookingStartDate } = filters, filterData = __rest(filters, ["searchTerm", "bookingStatus", "bookingStartDate"]);
    const andConditions = [];
    // Handling search term
    if (searchTerm) {
        andConditions.push({
            OR: booking_constant_1.BookingSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (bookingStatus) {
        andConditions.push({ bookingStatus: bookingStatus });
    }
    // Handling available after date
    if (bookingStartDate) {
        andConditions.push({ bookingStartDate: { gte: bookingStartDate } });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (booking_constant_1.BookingRelationalFields.includes(key)) {
                    return {
                        [booking_constant_1.BookingRelationalFieldsMapper[key]]: {
                            id: filterData[key],
                        },
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key],
                        },
                    };
                }
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.booking.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                bookingStartDate: 'desc',
            },
        include: {
            property: true,
        },
    });
    const total = yield prisma_1.default.booking.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleBooking = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const model = prisma_1.default.booking;
    const result = yield (0, utils_1.getUniqueRecord)(model, payload);
    return result;
});
const getSingleUserBooking = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.booking.findMany({
        where: {
            renterId: userId,
        },
        include: {
            property: true,
        },
    });
    return result;
});
//Update Booking
const updateBooking = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_a = payload.params) === null || _a === void 0 ? void 0 : _a.id) || !((_b = payload.user) === null || _b === void 0 ? void 0 : _b.id)) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    const { params, user, body } = payload;
    const { id: BookingId } = params;
    const { role } = user;
    if (role !== 'admin' && role !== 'owner') {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    const { bookingStatus } = body;
    const result = yield prisma_1.default.booking.update({
        where: { id: BookingId },
        data: { bookingStatus: bookingStatus },
    });
    return { success: true, data: result };
});
const deleteBooking = (authUser, deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    // First, check if the Booking exists
    const isBooked = yield prisma_1.default.booking.findUnique({
        where: {
            id: deletedId,
        },
    });
    if (!isBooked) {
        throw new ApiError_1.default(404, 'Booking not found');
    }
    const { role, id } = authUser;
    // Check permissions
    if (isBooked.renterId !== id && role !== 'admin' && role !== 'owner') {
        throw new ApiError_1.default(400, "You haven't permission to delete the Booking");
    }
    // Update the property status first in case booking deletion fails
    yield prisma_1.default.property.update({
        where: {
            id: isBooked === null || isBooked === void 0 ? void 0 : isBooked.propertyId,
        },
        data: {
            propertyStatus: 'available',
        },
    });
    // Now delete the booking
    const result = yield prisma_1.default.booking.delete({
        where: {
            id: deletedId,
        },
    });
    return { success: true, data: result };
});
exports.BookingService = {
    addBooking,
    getBookings,
    getSingleBooking,
    updateBooking,
    deleteBooking,
    getSingleUserBooking,
};
