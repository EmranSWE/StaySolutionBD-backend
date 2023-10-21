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
exports.ReviewService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const review_constant_1 = require("./review.constant");
const utils_1 = require("../../utils/utils");
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const addReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { file, user, body } = payload;
    // Validate file input
    if (!file) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    // Authorization check: Ensure user has the 'renter' role
    const { role } = user;
    if (role !== 'renter') {
        return {
            success: false,
            error: 'Unauthorized: You can only add a review as a renter',
        };
    }
    // Upload Marketplace image to Cloudinary using the stream approach
    const uploadedImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file.buffer);
    if (!(uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url)) {
        return { success: false, error: 'Failed to upload image' };
    }
    // Prepare property data with the uploaded image URL
    const updatedData = Object.assign(Object.assign({}, body), { reviewPic: [uploadedImage.secure_url], property: {
            connect: {
                id: body.propertyId,
            },
        }, renter: {
            connect: {
                id: user === null || user === void 0 ? void 0 : user.id, // Assuming the renter is the authenticated user
            },
        } });
    // Remove the direct `propertyId` and `renterId` as they're not needed anymore
    delete updatedData.propertyId;
    delete updatedData.renterId;
    // Create a new review record in the database using Prisma
    const result = yield prisma_1.default.review.create({
        data: updatedData,
    });
    // Return the created review data
    return { success: true, data: result };
});
const getAllReviews = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: review_constant_1.reviewSearchableFields.map(field => ({
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
                if (review_constant_1.reviewRelationalFields.includes(key)) {
                    return {
                        //@ts-ignore
                        [review_constant_1.reviewRelationalFields[key]]: {
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
    const result = yield prisma_1.default.review.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                rating: 'desc',
            },
    });
    const total = yield prisma_1.default.review.count({
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
const getSingleReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const model = prisma_1.default.review;
    const result = (0, utils_1.getUniqueRecord)(model, payload);
    return result;
});
const updateReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { file, user, body, review } = payload;
    // Validate file input
    if (!file) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    // Authorization check: Ensure user has the 'owner' role
    const { role } = user;
    if (role !== 'renter') {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    // Upload Marketplace image to Cloudinary using the stream approach
    const uploadedImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file.buffer);
    if (!(uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url)) {
        return { success: false, error: 'Failed to upload image' };
    }
    // Prepare property data with the uploaded image URL
    const updatedData = Object.assign(Object.assign({}, body), { reviewPic: [uploadedImage.secure_url] });
    const id = review.id;
    // Create a new property record in the database using Prisma
    const result = yield prisma_1.default.review.update({
        where: { id: id },
        data: updatedData,
    });
    // Return the created property data
    return { success: true, data: result };
});
const deleteReview = (authId, deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    const isSameUser = yield prisma_1.default.review.findUnique({
        where: {
            id: deletedId,
        },
    });
    // If the review does not exist, throw an error.
    if (!isSameUser) {
        throw new ApiError_1.default(404, 'Review not found');
    }
    if ((isSameUser === null || isSameUser === void 0 ? void 0 : isSameUser.renterId) !== authId) {
        throw new ApiError_1.default(400, "You haven't permission to change the review");
    }
    const result = yield prisma_1.default.review.delete({
        where: {
            id: deletedId,
        },
    });
    return result;
});
const singleUserReview = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const allReviews = yield prisma_1.default.review.findMany({
        where: {
            renterId: userId,
        },
    });
    // If the review does not exist, throw an error.
    if (!allReviews) {
        throw new ApiError_1.default(404, 'Review not found');
    }
    return allReviews;
});
const singlePropertiesRating = (propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    const propertyAvgRating = yield prisma_1.default.review.aggregate({
        where: {
            propertyId: propertyId,
        },
        _avg: {
            rating: true,
        },
    });
    const averageRating = propertyAvgRating._avg.rating;
    // If there's no average rating (e.g. no reviews exist), handle it appropriately.
    if (averageRating === null) {
        throw new ApiError_1.default(404, 'Review not found');
    }
    const avgRate = Math.round(averageRating);
    return avgRate; // return the rounded value
});
exports.ReviewService = {
    addReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    singleUserReview,
    singlePropertiesRating,
};
