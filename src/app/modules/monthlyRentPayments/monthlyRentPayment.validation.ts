import { z } from 'zod'

const CreatePaymentZodSchema = z.object({
  body: z.object({
    paymentMethod: z.string().optional(),

    paymentStatus: z
      .enum(['Completed', 'Pending', 'Failed'])
      .default('Pending'),
    securityDeposit: z.number().int().optional(),
    paymentAmount: z.number().int(),
  }),
})

export const PaymentValidation = {
  CreatePaymentZodSchema,
}
