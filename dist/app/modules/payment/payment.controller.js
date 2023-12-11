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
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const payment_service_1 = require("./payment.service");
const payment_constant_1 = require("./payment.constant");
const addPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        body: req.body,
        user: req.user,
    };
    const result = yield payment_service_1.PaymentService.addPayment(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment added successfully! ',
        data: result,
    });
}));
const addPaymentStripe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        body: req.body,
        user: req.user,
    };
    const result = yield payment_service_1.PaymentService.addPaymentStripe(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment added successfully! ',
        data: result,
    });
}));
const getPayments = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, payment_constant_1.paymentFilterableFields);
    const options = (0, pick_1.default)(req.query, payment_constant_1.IPaymentQueryOption);
    const result = yield payment_service_1.PaymentService.getPayments(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payments fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getAllRent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, payment_constant_1.paymentFilterableFields);
    const options = (0, pick_1.default)(req.query, payment_constant_1.IPaymentQueryOption);
    const result = yield payment_service_1.PaymentService.getAllRent(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payments fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// Getting a single Payment
const getSinglePayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const PaymentId = req.params.id;
    const result = yield payment_service_1.PaymentService.getSinglePayment(PaymentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Properties fetched successfully',
        data: result,
    });
}));
//Updating a single Payment
const updatePayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const payload = {
        body: req.body,
        file: req.file,
        params: req.params,
        user: req.user,
    };
    const result = yield payment_service_1.PaymentService.updatePayment(payload);
    res.status(200).json({
        success: true,
        message: 'Payment updated successfully',
        data: result,
    });
}));
//Delete a single Payment
const deletePayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const PaymentId = req.params.id;
    const ids = req.user;
    const result = yield payment_service_1.PaymentService.deletePayment(ids, PaymentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ' Payment deleted Successfully',
        data: result,
    });
}));
exports.PaymentController = {
    addPayment,
    addPaymentStripe,
    getPayments,
    getAllRent,
    getSinglePayment,
    updatePayment,
    deletePayment,
};
