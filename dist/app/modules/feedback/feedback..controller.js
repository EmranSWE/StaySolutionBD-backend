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
exports.FeedbackController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const feedback_service_1 = require("./feedback.service");
const property_constant_1 = require("../properties/property.constant");
const addFeedback = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        body: req.body,
        user: req.user,
    };
    const result = yield feedback_service_1.FeedbackService.addFeedback(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Feedback added successfully! ',
        data: result,
    });
}));
const getAllFeedbacks = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.default)(req.query, property_constant_1.IPropertyQueryOption);
    const result = yield feedback_service_1.FeedbackService.getAllFeedbacks(options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Properties fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
//Getting a single Feedback
// const getSingleFeedback = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const FeedbackId = req.params.id
//     const result = await FeedbackService.getSingleFeedback(FeedbackId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Single Feedbacks fetched successfully',
//       data: result,
//     })
//   },
// )
// //Updating a single Feedback
// const updateFeedback = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     if (req.body.data) {
//       req.body = JSON.parse(req.body.data)
//     }
//     const payload = {
//       body: req.body,
//       file: req.file,
//       user: req.user,
//       Feedback: req.params,
//     }
//     const result = await FeedbackService.updateFeedback(payload)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Single Feedbacks fetched successfully',
//       data: result,
//     })
//   },
// )
//Delete a single Feedback
const deleteFeedback = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const FeedbackId = req.params.id;
    const ids = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield feedback_service_1.FeedbackService.deleteFeedback(ids, FeedbackId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ' Feedback deleted Successfully',
        data: result,
    });
}));
//Get a single Feedback
const singleUserFeedback = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield feedback_service_1.FeedbackService.singleUserFeedback(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ' Get a single user all Feedback',
        data: result,
    });
}));
//Get a single Feedback
const updateFeedback = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const id = req.params.id;
    const result = yield feedback_service_1.FeedbackService.updateFeedback(data, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ' Get a single user all Feedback',
        data: result,
    });
}));
//Get a single Feedback
const getSingleFeedback = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbackId = req.params.id;
    const result = yield feedback_service_1.FeedbackService.getSingleFeedback(feedbackId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get a single feedback average rating',
        data: result,
    });
}));
exports.FeedbackController = {
    addFeedback,
    getAllFeedbacks,
    singleUserFeedback,
    getSingleFeedback,
    deleteFeedback,
    updateFeedback,
};
