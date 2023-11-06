"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const booking_service_1 = require("./booking.service");
const booking_constant_1 = require("./booking.constant");
const addBooking = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const payload = {
        body: req.body,
        user: req.user,
    };
    const result = yield booking_service_1.BookingService.addBooking(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Booking added successfully! ',
        data: result,
    });
}));
const getBookings = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, booking_constant_1.BookingFilterableFields);
    const options = (0, pick_1.default)(req.query, booking_constant_1.IBookingQueryOption);
    const result = yield booking_service_1.BookingService.getBookings(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Properties fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// Getting a single Booking
const getSingleBooking = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const BookingId = req.params.id;
    const result = yield booking_service_1.BookingService.getSingleBooking(BookingId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Properties fetched successfully',
        data: result,
    });
}));
// Getting a single User Booking
const getSingleUserBooking = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield booking_service_1.BookingService.getSingleUserBooking(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single User booking fetched successfully',
        data: result,
    });
}));
//Updating a single Booking
const updateBooking = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const payload = {
        body: req.body,
        params: req.params,
        user: req.user,
    };
    const result = yield booking_service_1.BookingService.updateBooking(payload);
    res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        data: result,
    });
}));
//Delete a single Booking
const deleteBooking = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const BookingId = req.params.id;
    const ids = req.user;
    const result = yield booking_service_1.BookingService.deleteBooking(ids, BookingId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ' Booking deleted Successfully',
        data: result,
    });
}));
// //Get a single Booking
// const singleUserBooking = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id
//     const result = await BookingService.singleUserBooking(userId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: ' Get a single user all Booking',
//       data: result,
//     })
//   },
// )
// //Get a single Booking
// const singlePropertiesRating = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const BookingId = req.params.id
//     const result = await BookingService.singlePropertiesRating(BookingId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Get a single Booking average rating',
//       data: result,
//     })
//   },
// )
exports.BookingController = {
    addBooking,
    getBookings,
    getSingleBooking,
    updateBooking,
    deleteBooking,
    getSingleUserBooking,
    // singleUserBooking,
    // singlePropertiesRating,
};
