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
exports.MarketplaceService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const marketplace_constant_1 = require("./marketplace.constant");
const addMarketplace = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { file, user, body } = payload;
    // Validate file input
    if (!file) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    // Authorization check: Ensure user has the 'owner' role
    const { role } = user;
    if (role !== 'owner') {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    // Upload Marketplace image to Cloudinary (or similar cloud storage)
    // const uploadedImage: ICloudinaryResponse =
    //   await FileUploadHelper.uploadToCloudinary(file as IUploadFile)
    const uploadedImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file.buffer);
    if (!(uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url)) {
        return { success: false, error: 'Failed to upload image' };
    }
    // Prepare Marketplace data with the uploaded image URL
    const updatedData = Object.assign(Object.assign({}, body), { ownerId: user.id, propertyImage: uploadedImage.secure_url });
    // Create a new Marketplace record in the database using Prisma
    const result = yield prisma_1.default.marketplace.create({
        data: updatedData,
        include: { owner: true },
    });
    // Return the created Marketplace data
    return { success: true, data: result };
});
const getMarketplaces = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, price, category } = filters, filterData = __rest(filters, ["searchTerm", "price", "category"]);
    const andConditions = [];
    // Handling search term
    if (searchTerm) {
        andConditions.push({
            OR: marketplace_constant_1.marketplaceSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // Handling number of rooms
    const priceInt = Number(price);
    if (!isNaN(priceInt)) {
        // Check if the parsed value is a valid number
        andConditions.push({ price: priceInt });
    }
    if (category) {
        andConditions.push({ category: category });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (marketplace_constant_1.marketplaceRelationalFields.includes(key)) {
                    return {
                        [marketplace_constant_1.marketplaceRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.marketplace.findMany({
        where: whereConditions,
        include: { owner: true },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                price: 'desc',
            },
    });
    const total = yield prisma_1.default.marketplace.count({
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
const getSingleMarketplace = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.marketplace.findUnique({
        where: {
            id: payload,
        },
        include: {
            owner: true,
        },
    });
    return result;
});
//Update Marketplace
const updateMarketplace = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_a = payload.params) === null || _a === void 0 ? void 0 : _a.id) || !((_b = payload.user) === null || _b === void 0 ? void 0 : _b.id)) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    const { file, params, user, body } = payload;
    const { id: MarketplaceId } = params;
    const { id: userId } = user;
    const existingMarketplace = yield prisma_1.default.marketplace.findUnique({
        where: {
            id: MarketplaceId,
        },
    });
    if ((existingMarketplace === null || existingMarketplace === void 0 ? void 0 : existingMarketplace.ownerId) !== userId) {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    const uploadedImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file.buffer);
    const updatedData = Object.assign(Object.assign({}, body), { propertyImage: uploadedImage.secure_url });
    const result = yield prisma_1.default.marketplace.update({
        where: { id: MarketplaceId },
        data: updatedData,
    });
    return { success: true, data: result };
});
const deleteMarketplace = (authUser, deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    const isSameUser = yield prisma_1.default.marketplace.findUnique({
        where: {
            id: deletedId,
        },
    });
    // If the Marketplace does not exist, throw an error.
    if (!isSameUser) {
        throw new ApiError_1.default(404, 'Marketplace not found');
    }
    const { role, id } = authUser;
    if (isSameUser.ownerId !== id && role !== 'admin' && role !== 'super_admin') {
        throw new ApiError_1.default(400, "You haven't permission to delete the Marketplace");
    }
    const result = yield prisma_1.default.marketplace.delete({
        where: {
            id: deletedId,
        },
    });
    return result;
});
const singleUserMarketplace = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.marketplace.findMany({
        where: { ownerId: userId },
        include: { owner: true },
    });
    return result;
});
exports.MarketplaceService = {
    addMarketplace,
    getMarketplaces,
    getSingleMarketplace,
    updateMarketplace,
    deleteMarketplace,
    singleUserMarketplace,
    // singlePropertiesRating,
};
