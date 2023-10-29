"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
const CreatePaymentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentMethod: zod_1.z.string().optional(),
        paymentStatus: zod_1.z
            .enum(['Completed', 'Pending', 'Failed'])
            .default('Pending'),
        securityDeposit: zod_1.z.number().int().optional(),
        paymentAmount: zod_1.z.number().int(),
    }),
});
exports.PaymentValidation = {
    CreatePaymentZodSchema,
};
