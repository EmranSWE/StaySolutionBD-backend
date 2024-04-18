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
exports.PropertyService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const property_constant_1 = require("./property.constant");
const utils_1 = require("../../utils/utils");
const addProperty = (payload) => __awaiter(void 0, void 0, void 0, function* () {
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
    // Upload Marketplace image to Cloudinary using the stream approach
    const uploadedImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file.buffer);
    if (!(uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url)) {
        return { success: false, error: 'Failed to upload image' };
    }
    // Prepare property data with the uploaded image URL
    const updatedData = Object.assign(Object.assign({}, body), { imageGallery: [uploadedImage.secure_url] });
    // Create a new property record in the database using Prisma
    const result = yield prisma_1.default.property.create({
        data: updatedData,
    });
    // Return the created property data
    return { success: true, data: result };
});
const getProperties = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, numberOfRooms, monthlyRent, size, maxOccupancy, propertyStatus } = filters, filterData = __rest(filters, ["searchTerm", "numberOfRooms", "monthlyRent", "size", "maxOccupancy", "propertyStatus"]);
    const andConditions = [];
    // Handling search term
    if (searchTerm) {
        andConditions.push({
            OR: property_constant_1.propertySearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // Handling number of rooms
    const numberOfRoomsInt = Number(numberOfRooms);
    if (!isNaN(numberOfRoomsInt)) {
        andConditions.push({ numberOfRooms: { lte: numberOfRoomsInt } });
    }
    // Handling number of rooms
    const maxOccupancyInt = Number(maxOccupancy);
    if (!isNaN(maxOccupancyInt)) {
        andConditions.push({ maxOccupancy: { lte: maxOccupancyInt } });
    }
    const monthlyRentInt = Number(monthlyRent);
    if (!isNaN(monthlyRentInt)) {
        andConditions.push({ monthlyRent: { lte: monthlyRentInt } });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (property_constant_1.propertyRelationalFields.includes(key)) {
                    return {
                        [property_constant_1.propertyRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.property.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.property.count({
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
const getSingleProperty = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const model = prisma_1.default.property;
    const result = yield (0, utils_1.getUniqueRecord)(model, payload);
    return result;
});
// Get featured Property
const getFeaturedProperties = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.property.findMany({
        where: {
            propertyStatus: 'available',
        },
        orderBy: {
            createdAt: 'asc',
        },
        take: 4,
    });
    return result;
});
//Update property
const updateProperty = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = payload.params) === null || _a === void 0 ? void 0 : _a.id)) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    const { file, params, user, body } = payload;
    const { id: propertyId } = params;
    const { id: userId, role } = user;
    const existingProperty = yield prisma_1.default.property.findUnique({
        where: {
            id: propertyId,
        },
    });
    if ((existingProperty === null || existingProperty === void 0 ? void 0 : existingProperty.ownerId) !== userId && role !== 'admin') {
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
    const updatedData = Object.assign(Object.assign({}, body), { imageGallery: {
            push: uploadedImage.secure_url,
        } });
    const result = yield prisma_1.default.property.update({
        where: { id: propertyId },
        data: updatedData,
    });
    return { success: true, data: result };
});
const deleteProperty = (authUser, deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    const isSameUser = yield prisma_1.default.property.findUnique({
        where: {
            id: deletedId,
        },
        include: {
            bookings: true,
        },
    });
    // If the property does not exist, throw an error.
    if (!isSameUser) {
        throw new ApiError_1.default(404, 'Property not found');
    }
    const { role, id } = authUser;
    if (isSameUser.ownerId !== id && role !== 'admin' && role !== 'super_admin') {
        throw new ApiError_1.default(400, "You haven't permission to delete the property");
    }
    const result = yield prisma_1.default.property.delete({
        where: {
            id: deletedId,
        },
    });
    return result;
});
const popularCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const properties = yield prisma_1.default.property.findMany();
    const tagFrequency = new Map();
    properties.forEach(property => {
        property.propertyTags.forEach(tag => {
            tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
        });
    });
    const sortedTags = Array.from(tagFrequency.entries()).sort((a, b) => b[1] - a[1]);
    // Get the top 3 most frequent tags
    const popularTags = sortedTags.slice(0, 4).map(entry => entry[0]);
    // Filter the properties to those that include the popular tags
    const popularProperties = properties.filter(property => property.propertyTags.some(tag => popularTags.includes(tag)));
    const popularCategoriesWithImages = popularProperties.map(property => ({
        category: property.propertyTags.filter(tag => popularTags.includes(tag)),
        imageGallery: property.imageGallery,
    }));
    return popularCategoriesWithImages;
});
const singleUserProperty = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.property.findMany({
        where: {
            ownerId: userId,
        },
    });
    return result;
});
const singleRenterProperty = (renterId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.property.findMany({
        where: {
            bookings: {
                some: {
                    renterId: renterId,
                    bookingStatus: 'Confirmed',
                },
            },
        },
        select: {
            id: true,
            flatNo: true,
        },
    });
    return result;
});
const singleOwnerProperty = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.property.findMany({
        where: {
            ownerId: ownerId,
        },
        select: {
            id: true,
            flatNo: true,
        },
    });
    return result;
});
const availableProperty = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield prisma_1.default.property.count({
        where: {
            propertyStatus: 'available',
        },
    });
    return count;
});
const bookedProperty = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield prisma_1.default.property.count({
        where: {
            propertyStatus: 'booked',
        },
    });
    return count;
});
exports.PropertyService = {
    addProperty,
    getProperties,
    getSingleProperty,
    updateProperty,
    deleteProperty,
    singleUserProperty,
    getFeaturedProperties,
    singleRenterProperty,
    singleOwnerProperty,
    popularCategory,
    availableProperty,
    bookedProperty,
};
