import { z } from 'zod'

const addPropertyZodSchema = z.object({
  body: z.object({
    address: z.string().min(5).max(30),
    numberOfRooms: z.number().int(),
    monthlyRent: z.number().positive(),
    flatNo: z.string(),
    isConditionGood: z.boolean().optional(),
    isElectricityOkay: z.boolean().optional(),
    isSanitaryOkay: z.boolean().optional(),
    ownerId: z
      .string({
        required_error: 'OwnerId is required',
        invalid_type_error: 'Id must be a string',
      })
      .refine(value => typeof value === 'string', {
        message: 'Owner ID should be a valid string',
      }),
  }),
})

const updatePropertyZodSchema = z.object({
  body: z.object({
    address: z.string().min(5).max(30),
    numberOfRooms: z.number().int(),
    monthlyRent: z.number().positive(),
    flatNo: z.string(),
    isConditionGood: z.boolean().optional(),
    isElectricityOkay: z.boolean().optional(),
    isSanitaryOkay: z.boolean().optional(),
    ownerId: z
      .string({
        required_error: 'OwnerId is required',
        invalid_type_error: 'Id must be a string',
      })
      .refine(value => typeof value === 'string', {
        message: 'Owner ID should be a valid string',
      }),
  }),
})
export const PropertyValidation = {
  addPropertyZodSchema,
  updatePropertyZodSchema,
}
