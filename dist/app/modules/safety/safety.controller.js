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
exports.SafetyController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const safety_service_1 = require("./safety.service");
const safety_constant_1 = require("./safety.constant");
const addSafety = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        body: req.body,
        user: req.user,
    };
    const result = yield safety_service_1.SafetyService.addSafety(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Safety added successfully! ',
        data: result,
    });
}));
const getSafeties = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, safety_constant_1.SafetyFilterableFields);
    const options = (0, pick_1.default)(req.query, safety_constant_1.ISafetyQueryOption);
    const result = yield safety_service_1.SafetyService.getProperties(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Properties fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// Getting a single Safety
const getSingleSafety = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const SafetyId = req.params.id;
    const result = yield safety_service_1.SafetyService.getSingleSafety(SafetyId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Properties fetched successfully',
        data: result,
    });
}));
//Updating a single Safety
const updateSafety = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        body: req.body,
        params: req.params,
        user: req.user,
    };
    const result = yield safety_service_1.SafetyService.updateSafety(payload);
    res.status(200).json({
        success: true,
        message: 'Safety updated successfully',
        data: result,
    });
}));
//Delete a single Safety
const deleteSafety = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const SafetyId = req.params.id;
    const ids = req.user;
    const result = yield safety_service_1.SafetyService.deleteSafety(ids, SafetyId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ' Safety deleted Successfully',
        data: result,
    });
}));
// //Get a single Safety
// const singleUserSafety = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id
//     const result = await SafetyService.singleUserSafety(userId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: ' Get a single user all Safety',
//       data: result,
//     })
//   },
// )
// //Get a single Safety
// const singlePropertiesRating = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const SafetyId = req.params.id
//     const result = await SafetyService.singlePropertiesRating(SafetyId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Get a single Safety average rating',
//       data: result,
//     })
//   },
// )
exports.SafetyController = {
    addSafety,
    getSafeties,
    getSingleSafety,
    updateSafety,
    deleteSafety,
    // singleUserSafety,
    // singlePropertiesRating,
};
