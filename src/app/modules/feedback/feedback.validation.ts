import { z } from 'zod'

const addReviewZodSchema = z.object({
  body: z.object({
    reviewTest: z.string(),
    rating: z
      .number()
      .int()
      .refine(value => value >= 1 && value <= 5, {
        message: 'Rating must be an integer between 1 and 5',
        path: ['body', 'rating'],
      }),
    propertyId: z.string().refine(value => value !== '', {
      message: 'Property ID is required',
      path: ['body', 'propertyId'],
    }),
    tenantId: z.string(),
  }),
})

const updateReviewZodSchema = z.object({
  body: z.object({
    reviewTest: z.string().optional(),
    rating: z
      .number()
      .int()
      .refine(value => value >= 1 && value <= 5, {
        message: 'Rating must be an integer between 1 and 5',
        path: ['body', 'rating'],
      })
      .optional(),
    propertyId: z.string().optional(),
    tenantId: z.string().optional(),
  }),
})
export const ReviewValidation = {
  addReviewZodSchema,
  updateReviewZodSchema,
}
