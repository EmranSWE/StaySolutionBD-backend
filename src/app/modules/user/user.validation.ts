import { z } from 'zod'

const CreateUserZodSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string(),
    address: z.string(),
  }),
})

export const UserValidation = {
  CreateUserZodSchema,
}
