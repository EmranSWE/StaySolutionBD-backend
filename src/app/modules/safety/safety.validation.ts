import { z } from 'zod'

const CreateSafetyZodSchema = z.object({
  body: z.object({
    safetyAmenities: z.array(z.string()),
    safetyScore: z.number(),
    propertyId: z.string(),
  }),
})

const UpdateSafetyZodSchema = z.object({
  body: z.object({
    safetyAmenities: z.array(z.string()).optional(),
    safetyScore: z.number().optional(),
    propertyId: z
      .string()
      .uuid()
      .optional()
      .refine(
        propertyId => !propertyId, // This means it will fail validation if propertyId is provided
        {
          message: 'You cannot provide a propertyId.',
        },
      ),
  }),
})

export const SafetyValidation = {
  CreateSafetyZodSchema,
  UpdateSafetyZodSchema,
}
