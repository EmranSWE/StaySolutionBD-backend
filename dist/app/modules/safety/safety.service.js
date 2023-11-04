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
exports.SafetyService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const safety_constant_1 = require("./safety.constant");
const utils_1 = require("../../utils/utils");
const addSafety = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = payload;
    // Authorization check: Ensure user has the 'owner' role
    const { role } = user;
    if (role !== 'owner' && role !== 'admin') {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    // Prepare Safety data with the uploaded image URL
    const updatedData = Object.assign({}, body);
    // Create a new Safetyrecord in the database using Prisma
    const result = yield prisma_1.default.safety.create({
        data: updatedData,
    });
    // Return the created Safety data
    return { success: true, data: result };
});
const getProperties = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, safetyScore } = filters, filterData = __rest(filters, ["searchTerm", "safetyScore"]);
    const andConditions = [];
    // Handling search term
    if (searchTerm) {
        andConditions.push({
            safetyAmenities: {
                has: searchTerm,
            },
        });
    }
    // Handling number of rooms
    const safetyScoreInt = Number(safetyScore);
    if (!isNaN(safetyScoreInt)) {
        // Check if the parsed value is a valid number
        andConditions.push({ safetyScore: safetyScoreInt });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (safety_constant_1.SafetyRelationalFields.includes(key)) {
                    return {
                        [safety_constant_1.SafetyRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.safety.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                safetyScore: 'desc',
            },
    });
    const total = yield prisma_1.default.safety.count({
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
const getSingleSafety = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const model = prisma_1.default.safety;
    const result = yield (0, utils_1.getUniqueRecord)(model, payload);
    return result;
});
//Update safety
const updateSafety = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_a = payload.params) === null || _a === void 0 ? void 0 : _a.id) || !((_b = payload.user) === null || _b === void 0 ? void 0 : _b.id)) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    const { params, body } = payload;
    const { id: safetyId } = params;
    const updatedData = Object.assign({}, body);
    const result = yield prisma_1.default.safety.update({
        where: { id: safetyId },
        data: updatedData,
    });
    return { success: true, data: result };
});
const deleteSafety = (authUser, deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.safety.delete({
        where: {
            id: deletedId,
        },
    });
    return result;
});
exports.SafetyService = {
    addSafety,
    getProperties,
    getSingleSafety,
    updateSafety,
    deleteSafety,
    // singleUserSafety,
    // singlePropertiesRating,
};
