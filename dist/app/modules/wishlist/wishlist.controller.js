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
exports.WishlistController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const wishlist_constant_1 = require("./wishlist.constant");
const wishlist_service_1 = require("./wishlist.service");
const addWishlist = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        body: req.body,
        user: req.user,
    };
    const result = yield wishlist_service_1.WishlistService.addWishlist(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Wishlist added successfully! ',
        data: result,
    });
}));
const getWishlist = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, wishlist_constant_1.wishlistFilterableFields);
    const options = (0, pick_1.default)(req.query, wishlist_constant_1.IWishlistQueryOption);
    const result = yield wishlist_service_1.WishlistService.getWishlist(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Wishlist fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// Getting a single Wishlist
const getSingleWishlist = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const WishlistId = req.params.id;
    const result = yield wishlist_service_1.WishlistService.getSingleWishlist(WishlistId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Properties fetched successfully',
        data: result,
    });
}));
//Updating a single Wishlist
const updateWishlist = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const payload = {
        body: req.body,
        file: req.file,
        params: req.params,
        user: req.user,
    };
    const result = yield wishlist_service_1.WishlistService.updateWishlist(payload);
    res.status(200).json({
        success: true,
        message: 'Wishlistupdated successfully',
        data: result,
    });
}));
//Delete a single Wishlist
const deleteWishlist = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const WishlistId = req.params.id;
    const ids = req.user;
    const result = yield wishlist_service_1.WishlistService.deleteWishlist(ids, WishlistId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ' Wishlistdeleted Successfully',
        data: result,
    });
}));
// //Get a single Wishlist
// const singleUserWishlist= catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id
//     const result = await WishlistService.singleUserWishlist(userId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: ' Get a single user all Wishlist',
//       data: result,
//     })
//   },
// )
// //Get a single Wishlist
// const singlePropertiesRating = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const WishlistId = req.params.id
//     const result = await WishlistService.singlePropertiesRating(WishlistId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Get a single Wishlistaverage rating',
//       data: result,
//     })
//   },
// )
exports.WishlistController = {
    addWishlist,
    getWishlist,
    getSingleWishlist,
    updateWishlist,
    deleteWishlist,
    // singleUserWishlist,
    // singlePropertiesRating,
};
