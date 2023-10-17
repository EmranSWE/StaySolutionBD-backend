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
exports.WishlistService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const wishlist_constant_1 = require("./wishlist.constant");
const utils_1 = require("../../utils/utils");
const addWishlist = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = payload;
    if (user.role !== 'renter') {
        return {
            success: false,
            error: 'Unauthorized: You cannot create wishlist',
        };
    }
    const updatedData = {
        renter: {
            connect: {
                id: user.id,
            },
        },
        property: {
            connect: {
                id: body.propertyId,
            },
        },
    };
    const result = yield prisma_1.default.wishList.create({
        data: updatedData,
    });
    return { success: true, data: result };
});
const getWishlist = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // Handling search term
    if (searchTerm) {
        andConditions.push({
            OR: wishlist_constant_1.wishlistSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (wishlist_constant_1.wishlistRelationalFields.includes(key)) {
                    return {
                        [wishlist_constant_1.wishlistRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.wishList.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                dateAdded: 'desc',
            },
    });
    const total = yield prisma_1.default.wishList.count({
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
const getSingleWishlist = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const model = prisma_1.default.wishList;
    const result = yield (0, utils_1.getUniqueRecord)(model, payload);
    return result;
});
//Update Wishlist
const updateWishlist = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!(payload === null || payload === void 0 ? void 0 : payload.file) || !((_a = payload.params) === null || _a === void 0 ? void 0 : _a.id) || !((_b = payload.user) === null || _b === void 0 ? void 0 : _b.id)) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    const { file, params, user, body } = payload;
    const { id: WishlistId } = params;
    const { id: userId } = user;
    const existingWishlist = yield prisma_1.default.wishList.findUnique({
        where: {
            id: WishlistId,
        },
    });
    if ((existingWishlist === null || existingWishlist === void 0 ? void 0 : existingWishlist.renterId) !== userId) {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    const updatedData = Object.assign({}, body);
    const result = yield prisma_1.default.wishList.update({
        where: { id: WishlistId },
        data: updatedData,
    });
    return { success: true, data: result };
});
const deleteWishlist = (authUser, deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    const isSameUser = yield prisma_1.default.wishList.findUnique({
        where: {
            id: deletedId,
        },
    });
    // If the Wishlist does not exist, throw an error.
    if (!isSameUser) {
        throw new ApiError_1.default(404, 'Wishlist not found');
    }
    const { role, id } = authUser;
    if (isSameUser.renterId !== id &&
        role !== 'admin' &&
        role !== 'super_admin') {
        throw new ApiError_1.default(400, "You haven't permission to delete the Wishlist");
    }
    const result = yield prisma_1.default.wishList.delete({
        where: {
            id: deletedId,
        },
    });
    return result;
});
exports.WishlistService = {
    addWishlist,
    getWishlist,
    getSingleWishlist,
    updateWishlist,
    deleteWishlist,
    // singleUserWishlist,
    // singlePropertiesRating,
};
