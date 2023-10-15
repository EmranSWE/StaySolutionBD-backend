import { z } from 'zod'

const addBookingZodSchema = z.object({
  body: z.object({
    reviewTest: z.string(),

    tenantId: z.string(),
  }),
})

export const BookingValidation = {
  addBookingZodSchema,
}
