"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyValidation = void 0;
const zod_1 = require("zod");
const CreateSafetyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        safetyAmenities: zod_1.z.array(zod_1.z.string()),
        safetyScore: zod_1.z.number(),
        propertyId: zod_1.z.string(),
    }),
});
const UpdateSafetyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        safetyAmenities: zod_1.z.array(zod_1.z.string()).optional(),
        safetyScore: zod_1.z.number().optional(),
        propertyId: zod_1.z
            .string()
            .uuid()
            .optional()
            .refine(propertyId => !propertyId, // This means it will fail validation if propertyId is provided
        {
            message: 'You cannot provide a propertyId.',
        }),
    }),
});
exports.SafetyValidation = {
    CreateSafetyZodSchema,
    UpdateSafetyZodSchema,
};
