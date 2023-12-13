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
exports.IssueService = void 0;
const issue_constant_1 = require("./issue.constant");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const utils_1 = require("../../utils/utils");
const addIssue = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate payload input
    if (!payload || !payload.body || !payload.user) {
        return { success: false, error: 'Invalid data or missing' };
    }
    // Destructure payload
    const { role, id: userId } = payload.user;
    const _a = payload.body, { propertyId } = _a, issueData = __rest(_a, ["propertyId"]);
    // Authorization check: Ensure user has the 'renter' role
    if (role !== 'renter') {
        return {
            success: false,
            error: 'Unauthorized: You cannot create an issue',
        };
    }
    const result = yield prisma_1.default.issue.create({
        data: Object.assign(Object.assign({}, issueData), { user: {
                connect: {
                    id: userId,
                },
            }, property: {
                connect: {
                    id: propertyId,
                },
            } }),
    });
    return { success: true, data: result };
});
const getProperties = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, issueStatus, priorityLevel, monthlyRent } = filters, filterData = __rest(filters, ["searchTerm", "issueStatus", "priorityLevel", "monthlyRent"]);
    const andConditions = [];
    // Handling search term
    if (searchTerm) {
        andConditions.push({
            OR: issue_constant_1.IIssueSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    // Check if the parsed value is a valid number
    if (priorityLevel !== undefined) {
        andConditions.push({ priorityLevel });
    }
    if (issueStatus !== undefined) {
        andConditions.push({ issueStatus });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (issue_constant_1.IIssueRelationalFields.includes(key)) {
                    return {
                        [issue_constant_1.IIssueRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.issue.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                reportDate: 'desc',
            },
    });
    const total = yield prisma_1.default.issue.count({
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
const getSingleIssue = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const model = prisma_1.default.issue;
    const result = yield (0, utils_1.getUniqueRecord)(model, payload);
    return result;
});
//Update Issue
const updateIssue = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    if (!((_b = payload.params) === null || _b === void 0 ? void 0 : _b.id) || !((_c = payload.user) === null || _c === void 0 ? void 0 : _c.id)) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    const { params, user, body } = payload;
    const { id: IssueId } = params;
    const { id: userId, role } = user;
    const existingIssue = yield prisma_1.default.issue.findUnique({
        where: {
            id: IssueId,
        },
    });
    if ((existingIssue === null || existingIssue === void 0 ? void 0 : existingIssue.renterId) !== userId && role !== 'admin') {
        return {
            success: false,
            error: 'Unauthorized: You cannot update this user',
        };
    }
    const { propertyId, renterId } = body, restData = __rest(body, ["propertyId", "renterId"]);
    const result = yield prisma_1.default.issue.update({
        where: { id: IssueId },
        data: restData,
    });
    return { success: true, data: result };
});
const deleteIssue = (authUser, deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    const isSameUser = yield prisma_1.default.issue.findUnique({
        where: {
            id: deletedId,
        },
    });
    // If the Issue does not exist, throw an error.
    if (!isSameUser) {
        throw new ApiError_1.default(404, 'Issue not found');
    }
    const { role, id } = authUser;
    if (isSameUser.renterId !== id &&
        role !== 'admin' &&
        role !== 'super_admin') {
        throw new ApiError_1.default(400, "You haven't permission to delete the Issue");
    }
    const result = yield prisma_1.default.issue.delete({
        where: {
            id: deletedId,
        },
    });
    return result;
});
const getSingleRenterIssue = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const allIssues = yield prisma_1.default.issue.findMany({
        where: {
            renterId: userId.id,
        },
    });
    if (!allIssues) {
        throw new ApiError_1.default(404, 'Review not found');
    }
    return allIssues;
});
exports.IssueService = {
    addIssue,
    getProperties,
    getSingleIssue,
    updateIssue,
    deleteIssue,
    getSingleRenterIssue,
};
