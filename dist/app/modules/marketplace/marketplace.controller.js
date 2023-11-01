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
exports.MarketplaceController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const marketplace_service_1 = require("./marketplace.service");
const marketplace_constant_1 = require("./marketplace.constant");
const addMarketplace = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const payload = {
        body: req.body,
        file: req.file,
        user: req.user,
    };
    const result = yield marketplace_service_1.MarketplaceService.addMarketplace(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Marketplace added successfully! ',
        data: result,
    });
}));
const getMarketplaces = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, marketplace_constant_1.marketplaceFilterableFields);
    const options = (0, pick_1.default)(req.query, marketplace_constant_1.IMarketplaceQueryOption);
    const result = yield marketplace_service_1.MarketplaceService.getMarketplaces(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Marketplace fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// Getting a single Marketplace
const getSingleMarketplace = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const MarketplaceId = req.params.id;
    const result = yield marketplace_service_1.MarketplaceService.getSingleMarketplace(MarketplaceId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Properties fetched successfully',
        data: result,
    });
}));
//Updating a single Marketplace
const updateMarketplace = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const payload = {
        body: req.body,
        file: req.file,
        params: req.params,
        user: req.user,
    };
    const result = yield marketplace_service_1.MarketplaceService.updateMarketplace(payload);
    res.status(200).json({
        success: true,
        message: 'Marketplace updated successfully',
        data: result,
    });
}));
//Delete a single Marketplace
const deleteMarketplace = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const MarketplaceId = req.params.id;
    const ids = req.user;
    const result = yield marketplace_service_1.MarketplaceService.deleteMarketplace(ids, MarketplaceId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ' Marketplace deleted Successfully',
        data: result,
    });
}));
//Get a single Marketplace
const singleUserMarketplace = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield marketplace_service_1.MarketplaceService.singleUserMarketplace(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get a my user all Property',
        data: result,
    });
}));
// //Get a single Marketplace
// const singlePropertiesRating = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const MarketplaceId = req.params.id
//     const result = await MarketplaceService.singlePropertiesRating(MarketplaceId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Get a single Marketplace average rating',
//       data: result,
//     })
//   },
// )
exports.MarketplaceController = {
    addMarketplace,
    getMarketplaces,
    getSingleMarketplace,
    updateMarketplace,
    deleteMarketplace,
    singleUserMarketplace,
    // singlePropertiesRating,
};
