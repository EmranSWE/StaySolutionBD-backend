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
exports.ReviewController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const review_service_1 = require("./review.service");
const review_constant_1 = require("./review.constant");
const user_constants_1 = require("../user/user.constants");
const addReview = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const payload = {
        body: req.body,
        file: req.file,
        user: req.user,
    };
    const result = yield review_service_1.ReviewService.addReview(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review added successfully! ',
        data: result,
    });
}));
const getAllReviews = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, review_constant_1.reviewFilterableFields);
    const options = (0, pick_1.default)(req.query, user_constants_1.IReviewQueryOption);
    const result = yield review_service_1.ReviewService.getAllReviews(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reviews fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
//Getting a single review
const getSingleReview = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewId = req.params.id;
    const result = yield review_service_1.ReviewService.getSingleReview(reviewId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Reviews fetched successfully',
        data: result,
    });
}));
//Updating a single review
const updateReview = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const payload = {
        body: req.body,
        file: req.file,
        user: req.user,
        review: req.params,
    };
    const result = yield review_service_1.ReviewService.updateReview(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Reviews fetched successfully',
        data: result,
    });
}));
//Delete a single review
const deleteReview = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const reviewId = req.params.id;
    const ids = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield review_service_1.ReviewService.deleteReview(ids, reviewId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ' Review deleted Successfully',
        data: result,
    });
}));
//Get a single review
const singleUserReview = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield review_service_1.ReviewService.singleUserReview(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ' Get a single user all review',
        data: result,
    });
}));
//Get a single review
const singlePropertiesRating = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const propertyId = req.params.id;
    const result = yield review_service_1.ReviewService.singlePropertiesRating(propertyId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get a single property average rating',
        data: result,
    });
}));
exports.ReviewController = {
    addReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    singleUserReview,
    singlePropertiesRating,
};
