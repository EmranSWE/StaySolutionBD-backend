"use strict";
/* eslint-disable no-unsafe-optional-chaining */
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
exports.PaymentService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const utils_1 = require("../../utils/utils");
const payment_constant_1 = require("./payment.constant");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
});
const addPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = payload;
    // Authorization check: Ensure user has the 'owner' role
    const { role, id: userId } = user;
    if (role !== 'renter') {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    // Prepare Payment data with the uploaded image URL
    const updatedData = Object.assign(Object.assign({}, body), { renterId: userId });
    // Create a new Payment record in the database using Prisma
    const result = yield prisma_1.default.payment.create({
        data: updatedData,
    });
    // Return the created Payment data
    return { success: true, data: result };
});
const addPaymentStripe = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = payload;
    const { token, paymentId } = body;
    const { role, id: userId } = user;
    if (role !== 'renter') {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    const booking = yield prisma_1.default.booking.findUnique({
        where: {
            id: paymentId,
        },
        include: {
            property: true,
            renter: true,
        },
    });
    //@ts-ignore
    const { description, monthlyRent } = booking === null || booking === void 0 ? void 0 : booking.property;
    const stripeCustomer = yield stripe.customers.create({
        //@ts-ignore
        email: user.email,
        source: token,
        address: {
            city: 'Imran',
            country: 'Bangladesh',
            line1: 'Arshinagr',
            line2: null,
            postal_code: '10001',
            state: 'dhaka',
        },
        shipping: {
            name: 'Imran',
            address: {
                city: 'Dhaka',
                country: null,
                line1: 'KK 137 ST',
                line2: null,
                postal_code: '10001',
                state: null,
            },
        },
        name: 'imran',
        phone: '01838235450',
    });
    // CREATE STRIPE CHARGE
    const stripeCharge = yield stripe.charges.create({
        amount: monthlyRent * 100,
        currency: 'usd',
        customer: stripeCustomer.id,
        description: `Purchased the ${description} for ${monthlyRent}`,
    });
    const updateStatus = {
        bookingStatus: 'Confirmed',
    };
    if (stripeCharge.status === 'succeeded') {
        const result = yield prisma_1.default.booking.update({
            where: { id: paymentId },
            data: updateStatus,
        });
        return { success: true, data: result };
    }
});
//Get all payments
const getPayments = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, paymentStatus, paymentAmount } = filters, filterData = __rest(filters, ["searchTerm", "paymentStatus", "paymentAmount"]);
    const andConditions = [];
    // Handling search term
    if (searchTerm) {
        andConditions.push({
            OR: payment_constant_1.paymentSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // Handling number of rooms
    const paymentAmountInt = Number(paymentAmount);
    if (!isNaN(paymentAmountInt)) {
        // Check if the parsed value is a valid number
        andConditions.push({ paymentAmount: paymentAmountInt });
    }
    if (paymentStatus) {
        andConditions.push({ paymentStatus: paymentStatus });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (payment_constant_1.paymentRelationalFields.includes(key)) {
                    return {
                        [payment_constant_1.paymentRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.payment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                paymentAmount: 'desc',
            },
    });
    const total = yield prisma_1.default.payment.count({
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
const getAllRent = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, paymentStatus, paymentAmount } = filters, filterData = __rest(filters, ["searchTerm", "paymentStatus", "paymentAmount"]);
    const andConditions = [];
    // Handling search term
    if (searchTerm) {
        andConditions.push({
            OR: payment_constant_1.paymentSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // Handling number of rooms
    const paymentAmountInt = Number(paymentAmount);
    if (!isNaN(paymentAmountInt)) {
        // Check if the parsed value is a valid number
        andConditions.push({ paymentAmount: paymentAmountInt });
    }
    if (paymentStatus) {
        andConditions.push({ paymentStatus: paymentStatus });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (payment_constant_1.paymentRelationalFields.includes(key)) {
                    return {
                        [payment_constant_1.paymentRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.payment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                paymentAmount: 'desc',
            },
        include: {
            booking: {
                include: {
                    property: true,
                },
            },
        },
    });
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    // Define the type for groupedByMonth
    const groupedByMonth = {};
    result.forEach(payment => {
        var _a, _b;
        const paymentDate = new Date(payment.paymentDate);
        const month = monthNames[paymentDate.getMonth()];
        if (!groupedByMonth[month]) {
            groupedByMonth[month] = [];
        }
        groupedByMonth[month].push({
            flatNo: ((_b = (_a = payment.booking) === null || _a === void 0 ? void 0 : _a.property) === null || _b === void 0 ? void 0 : _b.flatNo) || null,
            paymentStatus: payment.paymentStatus,
        });
    });
    // console.log(result.booking.bookingId)
    const total = yield prisma_1.default.payment.count({
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
//Get single payment details
const getSinglePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const model = prisma_1.default.payment;
    const result = yield (0, utils_1.getUniqueRecord)(model, payload);
    return result;
});
//Update Payment
const updatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_a = payload.params) === null || _a === void 0 ? void 0 : _a.id) || !((_b = payload.user) === null || _b === void 0 ? void 0 : _b.id)) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    const { params, user, body } = payload;
    const { id: PaymentId } = params;
    const { role } = user;
    if (role !== 'admin' && role !== 'owner') {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    const { paymentStatus } = body;
    const result = yield prisma_1.default.payment.update({
        where: { id: PaymentId },
        data: { paymentStatus: paymentStatus },
    });
    return { success: true, data: result };
});
const deletePayment = (authUser, deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    const isSameUser = yield prisma_1.default.payment.findUnique({
        where: {
            id: deletedId,
        },
    });
    // If the Payment does not exist, throw an error.
    if (!isSameUser) {
        throw new ApiError_1.default(404, 'Payment not found');
    }
    const { role, id } = authUser;
    if (isSameUser.renterId !== id &&
        role !== 'admin' &&
        role !== 'super_admin') {
        throw new ApiError_1.default(400, "You haven't permission to delete the Payment");
    }
    const result = yield prisma_1.default.payment.delete({
        where: {
            id: deletedId,
        },
    });
    return result;
});
exports.PaymentService = {
    addPayment,
    addPaymentStripe,
    getPayments,
    getSinglePayment,
    updatePayment,
    deletePayment,
    getAllRent,
};
