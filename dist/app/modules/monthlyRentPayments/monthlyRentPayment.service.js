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
exports.MonthlyRentPaymentService = exports.getCurrentMonthPayments = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const monthlyRentPayment_constant_1 = require("./monthlyRentPayment.constant");
const monthlyRentPayments_utils_1 = require("./monthlyRentPayments.utils");
const addMonthlyRentPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = payload;
    const { id: userId } = user;
    const { bookingId } = body, rest = __rest(body, ["bookingId"]);
    const booking = yield prisma_1.default.booking.findUnique({
        where: {
            id: bookingId,
        },
    });
    const propertyId = booking === null || booking === void 0 ? void 0 : booking.propertyId;
    // Prepare MonthlyRentPayment data with the uploaded image URL
    const updatedData = Object.assign(Object.assign({}, rest), { propertyId: propertyId, renterId: userId });
    // Create a new MonthlyRentPayment record in the database using Prisma
    const result = yield prisma_1.default.monthlyRentPayment.create({
        data: updatedData,
    });
    // Check if the payment is completed (you need to implement this logic)
    const paymentCompleted = true; // You need to set this based on your payment gateway logic
    if (paymentCompleted) {
        // Update the bookingStatus to 'confirmed' and propertyStatus to 'booked'
        yield prisma_1.default.booking.update({
            where: {
                id: bookingId,
            },
            data: {
                bookingStatus: 'Confirmed',
            },
        });
        // Assuming you have a 'property' field in the 'booking' table that you want to update
        yield prisma_1.default.property.update({
            where: {
                id: propertyId,
            },
            data: {
                propertyStatus: 'booked',
            },
        });
    }
    // Return the created MonthlyRentPayment data
    return { success: true, data: result };
});
const addRegularMonthlyRentPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = payload;
    const { id: renterId } = user;
    const { bookingId } = body, rest = __rest(body, ["bookingId"]);
    const updatedData = Object.assign(Object.assign({}, rest), { renterId: renterId });
    // Create a new MonthlyRentPayment record in the database using Prisma
    const result = yield prisma_1.default.monthlyRentPayment.create({
        data: updatedData,
    });
    // Return the created MonthlyRentPayment data
    return { success: true, data: result };
});
//Get all MonthlyRentPayments
const getMonthlyRentPayments = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, MonthlyRentPaymentStatus, MonthlyRentPaymentAmount } = filters, filterData = __rest(filters, ["searchTerm", "MonthlyRentPaymentStatus", "MonthlyRentPaymentAmount"]);
    const andConditions = [];
    // Handling search term
    if (searchTerm) {
        andConditions.push({
            OR: monthlyRentPayment_constant_1.MonthlyRentPaymentSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // Handling number of rooms
    const MonthlyRentPaymentAmountInt = Number(MonthlyRentPaymentAmount);
    if (!isNaN(MonthlyRentPaymentAmountInt)) {
        // Check if the parsed value is a valid number
        andConditions.push({
            MonthlyRentPaymentAmount: MonthlyRentPaymentAmountInt,
        });
    }
    if (MonthlyRentPaymentStatus) {
        andConditions.push({ MonthlyRentPaymentStatus: MonthlyRentPaymentStatus });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (monthlyRentPayment_constant_1.MonthlyRentPaymentRelationalFields.includes(key)) {
                    return {
                        [monthlyRentPayment_constant_1.MonthlyRentPaymentRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.monthlyRentPayment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                amount: 'desc',
            },
        include: {
            property: true,
        },
    });
    const total = yield prisma_1.default.monthlyRentPayment.count({
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
//Get single MonthlyRentPayment details
const getSingleMonthlyRentPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.monthlyRentPayment.findUnique({
        where: {
            id: payload,
        },
        include: {
            renter: true,
            property: true,
        },
    });
    return result;
});
//Get single MonthlyRentPayment details
const thisMonthTotalRents = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const result = yield prisma_1.default.monthlyRentPayment.findMany({
        where: {
            month: currentMonth,
            year: currentDate.getFullYear(),
        },
    });
    // Calculate total amount
    const totalAmount = result.reduce((acc, payment) => { var _a; return acc + ((_a = payment.amount) !== null && _a !== void 0 ? _a : 0); }, 0);
    return totalAmount;
});
const getMonthWiseMonthlyRentPayment = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all payments from the database
        const payments = yield prisma_1.default.monthlyRentPayment.findMany({
            where: {
                status: 'Completed', // Filter by 'Completed' status if necessary
            },
            select: {
                month: true,
                year: true,
                amount: true,
            },
        });
        // Group and sum payments by month and year
        const groupedPayments = payments.reduce((acc, payment) => {
            const monthYearKey = `${payment.year}-${payment.month
                .toString()
                .padStart(2, '0')}`;
            //@ts-ignore
            if (!acc[monthYearKey]) {
                //@ts-ignore
                acc[monthYearKey] = 0;
            }
            //@ts-ignore
            acc[monthYearKey] += payment.amount;
            return acc;
        }, {});
        // Convert grouped payments into an array for the response
        const result = Object.entries(groupedPayments).map(([monthYear, totalAmount]) => {
            const [year, month] = monthYear.split('-');
            return {
                month,
                year,
                totalAmount,
            };
        });
        return result;
    }
    catch (error) {
        throw new ApiError_1.default(500, 'Error Found');
    }
});
//Get flat status details
const getFlatStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const properties = yield prisma_1.default.property.findMany({
            select: {
                flatNo: true,
                propertyStatus: true,
            },
            orderBy: {
                flatNo: 'asc', // This will sort the results by flatNo in ascending order
            },
        });
        // Transform the data to the desired format
        const flatStatus = properties.map(property => ({
            flatNo: property.flatNo,
            status: property.propertyStatus,
        }));
        return flatStatus;
    }
    catch (error) {
        throw new ApiError_1.default(500, 'Error Found');
    }
});
//Get flat status details
const getAllFlat = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const properties = yield prisma_1.default.property.findMany({
            select: {
                flatNo: true,
                id: true,
            },
            orderBy: {
                flatNo: 'asc',
            },
        });
        return properties;
    }
    catch (error) {
        throw new ApiError_1.default(500, 'Error Found');
    }
});
//Get single MonthlyRentPayment details
const getSingleUserMonthlyRentPayment = (renterId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.monthlyRentPayment.findMany({
        where: {
            renterId: renterId,
        },
        select: {
            month: true,
            year: true,
            status: true,
            amount: true,
        },
    });
    return result;
});
//Get total MonthlyRentPayment details
const getTotalMonthlyRentPayment = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalRent = yield prisma_1.default.monthlyRentPayment.aggregate({
        _sum: {
            amount: true,
        },
    });
    return totalRent._sum.amount || 0;
});
// Get total rent amount for a specific property
const getSpecificPropertyTotalPayment = (propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!propertyId) {
        throw new Error('Property ID must be provided');
    }
    const totalRent = yield prisma_1.default.monthlyRentPayment.aggregate({
        where: {
            propertyId: propertyId,
        },
        _sum: {
            amount: true,
        },
    });
    return totalRent._sum.amount || 0;
});
//Get Single User total MonthlyRentPayment details
const singleUserTotalRentAmount = (renterId) => __awaiter(void 0, void 0, void 0, function* () {
    const totalRent = yield prisma_1.default.monthlyRentPayment.findMany({
        where: {
            renterId: renterId,
        },
    });
    const totalAmount = totalRent.reduce((acc, payment) => { var _a; return acc + ((_a = payment.amount) !== null && _a !== void 0 ? _a : 0); }, 0) || 0;
    return totalAmount;
});
//Get Single User total MonthlyRentPayment details
const singleOwnerTotalEarn = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = yield prisma_1.default.property.findMany({
        where: {
            ownerId: ownerId,
        },
        include: {
            monthlyRentPayments: true,
        },
    });
    let totalAmount = 0;
    properties.forEach(property => {
        const monthlyRentPayments = property.monthlyRentPayments || [];
        monthlyRentPayments.forEach(payment => {
            totalAmount += payment.amount || 0;
        });
    });
    return totalAmount;
});
//Get Single User total MonthlyRentPayment details
const singleOwnerTotalProperty = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const properties = yield prisma_1.default.property.findMany({
        where: {
            ownerId: ownerId,
        },
    });
    const totalFlat = properties.length;
    const totalBooked = properties.filter(property => property.propertyStatus === 'booked').length;
    const totalAvailable = properties.filter(property => property.propertyStatus === 'available').length;
    return {
        totalFlat: totalFlat,
        totalBooked: totalBooked,
        totalAvailable: totalAvailable,
    };
});
// Get total details of payment for a specific property
const getSpecificPropertyPaymentDetails = (propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!propertyId) {
        throw new Error('Property ID must be provided');
    }
    const totalRent = yield prisma_1.default.monthlyRentPayment.findMany({
        where: {
            propertyId: propertyId,
        },
        select: {
            month: true,
            year: true,
            status: true,
            amount: true,
            paymentDate: true,
        },
    });
    return totalRent;
});
const deleteMonthlyRentPayment = (authUser, deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    const isSamePropertyPayment = yield prisma_1.default.monthlyRentPayment.findUnique({
        where: {
            id: deletedId,
        },
    });
    // If the MonthlyRentPayment does not exist, throw an error.
    if (!isSamePropertyPayment) {
        throw new ApiError_1.default(404, 'MonthlyRentPayment not found');
    }
    const { role, id } = authUser;
    if (isSamePropertyPayment.renterId !== id &&
        role !== 'admin' &&
        role !== 'super_admin') {
        throw new ApiError_1.default(400, "You haven't permission to delete the MonthlyRentPayment");
    }
    const result = yield prisma_1.default.monthlyRentPayment.delete({
        where: {
            id: deletedId,
        },
    });
    return result;
});
// Get Upcoming month payment details
const getCurrentMonthPayments = (propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    const property = yield prisma_1.default.property.findUnique({
        where: { id: propertyId },
        include: {
            bookings: true,
            monthlyRentPayments: true,
        },
    });
    if (!property || property.propertyStatus !== 'booked') {
        return 'No confirmed bookings found for this property.';
    }
    const confirmedBooking = property.bookings.find((booking) => booking.bookingStatus === 'Confirmed');
    if (!confirmedBooking) {
        return 'No confirmed bookings found.';
    }
    const latestPayment = property.monthlyRentPayments[property.monthlyRentPayments.length - 1];
    if (!latestPayment || latestPayment.status !== 'Completed') {
        return 'Latest payment is not completed or no payments found.';
    }
    const remainingMonthsForPayment = (0, monthlyRentPayments_utils_1.getUpcomingPaymentMonths)(latestPayment);
    return remainingMonthsForPayment;
});
exports.getCurrentMonthPayments = getCurrentMonthPayments;
exports.MonthlyRentPaymentService = {
    addMonthlyRentPayment,
    getMonthlyRentPayments,
    getSingleMonthlyRentPayment,
    getTotalMonthlyRentPayment,
    getSpecificPropertyTotalPayment,
    getSpecificPropertyPaymentDetails,
    addRegularMonthlyRentPayment,
    getSingleUserMonthlyRentPayment,
    deleteMonthlyRentPayment,
    getCurrentMonthPayments: exports.getCurrentMonthPayments,
    getMonthWiseMonthlyRentPayment,
    getFlatStatus,
    getAllFlat,
    singleUserTotalRentAmount,
    thisMonthTotalRents,
    singleOwnerTotalEarn,
    singleOwnerTotalProperty,
};
