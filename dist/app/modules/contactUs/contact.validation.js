"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const addReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        reviewTest: zod_1.z.string(),
        rating: zod_1.z
            .number()
            .int()
            .refine(value => value >= 1 && value <= 5, {
            message: 'Rating must be an integer between 1 and 5',
            path: ['body', 'rating'],
        }),
        propertyId: zod_1.z.string().refine(value => value !== '', {
            message: 'Property ID is required',
            path: ['body', 'propertyId'],
        }),
        tenantId: zod_1.z.string(),
    }),
});
const updateReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        reviewTest: zod_1.z.string().optional(),
        rating: zod_1.z
            .number()
            .int()
            .refine(value => value >= 1 && value <= 5, {
            message: 'Rating must be an integer between 1 and 5',
            path: ['body', 'rating'],
        })
            .optional(),
        propertyId: zod_1.z.string().optional(),
        tenantId: zod_1.z.string().optional(),
    }),
});
exports.ReviewValidation = {
    addReviewZodSchema,
    updateReviewZodSchema,
};
