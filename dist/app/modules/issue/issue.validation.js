"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueValidation = void 0;
const zod_1 = require("zod");
const CreateIssueZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        issueDescription: zod_1.z.string({
            required_error: 'Description is required',
            invalid_type_error: 'Description must be a string',
        }),
        issueStatus: zod_1.z.enum(['OPEN']),
        priorityLevel: zod_1.z.enum(['Low', 'Medium', 'High']),
        renterId: zod_1.z.string().uuid().optional(),
    }),
});
const UpdateIssueZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        issueDescription: zod_1.z
            .string({
            required_error: 'Description is required',
            invalid_type_error: 'Description must be a string',
        })
            .optional(),
        issueStatus: zod_1.z
            .enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
            .optional(),
        priorityLevel: zod_1.z.enum(['Low', 'Medium', 'High']).optional(),
    }),
});
exports.IssueValidation = {
    CreateIssueZodSchema,
    UpdateIssueZodSchema,
};
