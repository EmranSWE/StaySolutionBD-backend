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
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_constants_1 = require("./user.constants");
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const http_status_1 = __importDefault(require("http-status"));
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const utils_1 = require("../../utils/utils");
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(data === null || data === void 0 ? void 0 : data.password)) {
        throw new ApiError_1.default(400, 'Password is required');
    }
    const hashedPassword = yield bcrypt_1.default.hash(data.password, Number(config_1.default.bcrypt_salt_rounds));
    data.password = hashedPassword;
    const result = yield prisma_1.default.user.create({ data });
    // Hide sensitive data
    const { password } = result, userData = __rest(result, ["password"]);
    return userData;
});
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(data === null || data === void 0 ? void 0 : data.password) || !(data === null || data === void 0 ? void 0 : data.email)) {
        throw new ApiError_1.default(400, 'Both username and password are required');
    }
    // Find the user in the database by their username
    const user = yield prisma_1.default.user.findUnique({
        where: { email: data.email }, // or use email if that's your unique identifier
    });
    if (!user) {
        throw new ApiError_1.default(404, 'User not found');
    }
    // Compare the input password with the stored hashed password
    const isPasswordCorrect = yield bcrypt_1.default.compare(data.password, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError_1.default(401, 'Invalid password');
    }
    //Access token and refresh token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ email: user.email, role: user.role, id: user.id }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    //refresh token and refresh token
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ email: user.email, role: user.role, id: user.id }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return { accessToken, refreshToken };
});
const updateUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_a = payload.params) === null || _a === void 0 ? void 0 : _a.id) || !((_b = payload.user) === null || _b === void 0 ? void 0 : _b.id)) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    const { file, params, user, body } = payload;
    const { id: paramsId } = params;
    const { id: userId } = user;
    if (paramsId !== userId) {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    if (body.email) {
        return { success: false, error: 'You cannot update primary email' };
    }
    // Upload Marketplace image to Cloudinary using the stream approach
    const uploadedImage = yield FileUploadHelper_1.FileUploadHelper.uploadToCloudinary(file.buffer);
    if (!(uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url)) {
        return { success: false, error: 'Failed to upload image' };
    }
    const updatedData = Object.assign(Object.assign({}, body), { profilePic: uploadedImage.secure_url });
    const result = yield prisma_1.default.user.update({
        where: { id: userId },
        data: updatedData,
    });
    return { success: true, data: result };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid token');
    }
    const { email, role } = verifiedToken;
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: email },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist");
    }
    //Access token and refresh token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({ email: email, role: role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const getUsers = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: user_constants_1.userSearchableFields.map(field => ({
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
                if (user_constants_1.userRelationalFields.includes(key)) {
                    return {
                        [user_constants_1.userRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.user.count({
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
const changePassword = (currentUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    // Validate provided data
    if (!oldPassword || !newPassword) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Old password and new password are required');
    }
    // Ensure that the password field in the database is not null or undefined
    if (oldPassword === newPassword) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "You can't use old password");
    }
    try {
        const existingUser = yield prisma_1.default.user.findUnique({
            where: { email: currentUser.email },
        });
        if (!existingUser) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        // Ensure that the password field in the database is not null or undefined
        if (!existingUser.password) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Stored password is missing');
        }
        // Compare the provided old password with the stored hashed password
        const isPasswordCorrect = yield bcrypt_1.default.compare(oldPassword, existingUser.password);
        if (!isPasswordCorrect) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid old password');
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
        // Update the user's password
        const updateData = {
            password: hashedPassword,
            passwordChangedAt: new Date(),
        };
        yield prisma_1.default.user.update({
            where: { email: existingUser.email },
            data: updateData,
        });
        return { message: 'Password updated successfully' };
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
    }
});
const getSingleUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const model = prisma_1.default.user;
    const result = yield (0, utils_1.getUniqueRecord)(model, payload);
    return result;
});
const deleteUser = (authId, deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    const isSameUser = yield prisma_1.default.user.findUnique({
        where: {
            id: deletedId,
        },
    });
    if (!isSameUser) {
        throw new ApiError_1.default(404, 'User not found');
    }
    if ((isSameUser === null || isSameUser === void 0 ? void 0 : isSameUser.id) !== authId.id &&
        authId.role !== 'admin' &&
        authId.role !== 'super_admin') {
        throw new ApiError_1.default(400, "You haven't permission to delete");
    }
    const result = yield prisma_1.default.user.delete({
        where: {
            id: deletedId,
        },
    });
    return result;
});
exports.UserService = {
    createUser,
    getUsers,
    getSingleUser,
    changePassword,
    loginUser,
    updateUser,
    refreshToken,
    deleteUser,
};
