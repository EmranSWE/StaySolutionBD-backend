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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const addFeedback = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = payload;
    // Authorization check: Ensure user has the 'renter' role
    const { role, id } = user;
    if (role !== 'renter' && role !== 'owner') {
        return {
            success: false,
            error: 'Unauthorized: You can only add a Feedback as a renter or owner',
        };
    }
    // Prepare property data with the uploaded image URL
    const updatedData = Object.assign(Object.assign({}, body), { userId: id });
    const result = yield prisma_1.default.feedback.create({
        data: updatedData,
    });
    return { success: true, data: result };
});
const getAllFeedbacks = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const result = yield prisma_1.default.feedback.findMany({
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                rating: 'desc',
            },
        include: {
            user: true,
        },
    });
    const total = yield prisma_1.default.feedback.count({});
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
// const getAllFeedbacks = async () => {
//   const result = await prisma.Feedback.findMany({
//     where: whereConditions,
//   })
//   return result
// }
// const getSingleFeedback = async (payload: any) => {
//   const model = prisma.Feedback
//   const result = getUniqueRecord(model, payload)
//   return result
// }
// const updateFeedback = async (payload: IPayload) => {
//   const { file, user, body, Feedback } = payload
//   // Validate file input
//   if (!file) {
//     return { success: false, error: 'Invalid input or file is missing' }
//   }
//   // Authorization check: Ensure user has the 'owner' role
//   const { role } = user
//   if (role !== 'renter') {
//     return {
//       success: false,
//       error: 'Unauthorized: You cannot update this user',
//     }
//   }
//   // Prepare property data with the uploaded image URL
//   const updatedData = {
//     ...body,
//   }
//   const id = Feedback.id
//   // Create a new property record in the database using Prisma
//   const result = await prisma.Feedback.update({
//     where: { id: id },
//     data: updatedData,
//   })
//   // Return the created property data
//   return { success: true, data: result }
// }
const deleteFeedback = (authId, deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    // const isSameUser = await prisma.Feedback.findUnique({
    //   where: {
    //     id: deletedId,
    //   },
    // })
    // // If the Feedback does not exist, throw an error.
    // if (!isSameUser) {
    //   throw new ApiError(404, 'Feedback not found')
    // }
    // if (isSameUser?.renterId !== authId) {
    //   throw new ApiError(400, "You haven't permission to change the Feedback")
    // }
    const result = yield prisma_1.default.feedback.delete({
        where: {
            id: deletedId,
        },
    });
    return result;
});
const singleUserFeedback = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const myFeedback = yield prisma_1.default.feedback.findMany({
        where: {
            userId: userId,
        },
    });
    return myFeedback;
});
const getSingleFeedback = (feedbackId) => __awaiter(void 0, void 0, void 0, function* () {
    const feedback = yield prisma_1.default.feedback.findUnique({
        where: {
            id: feedbackId,
        },
    });
    return feedback; // return the rounded value
});
const updateFeedback = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        return { success: false, error: 'Invalid input or file is missing' };
    }
    const result = yield prisma_1.default.feedback.update({
        where: { id: id },
        data: data,
    });
    return { success: true, data: result };
});
exports.FeedbackService = {
    addFeedback,
    getAllFeedbacks,
    getSingleFeedback,
    deleteFeedback,
    singleUserFeedback,
    updateFeedback,
};
