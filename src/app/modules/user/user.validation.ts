import { z } from 'zod'
const allowedDomains = [
  'gmail.com',
  'example.com',
  'yahoo.com ',
  'outlook.com',
  'icloud.com',
  'hotmail.com',
  'msn.com',
]
const blockedDomains = ['blocked.com']
const disposableEmailProviders = ['mailinator.com', 'tempmail.com']
const EmailSchema = z
  .string()
  .email({ message: 'Invalid email address' })
  .transform(val => val.toLowerCase().trim())
  .refine(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
    message: 'Invalid email format.',
    path: ['email'],
  })

  .refine(email => !blockedDomains.includes(email.split('@')[1]), {
    message: 'Email domain is blocked.',
    path: ['email'],
  })
  .refine(email => !disposableEmailProviders.includes(email.split('@')[1]), {
    message: 'Disposable email addresses are not allowed.',
    path: ['email'],
  })
  .refine(email => allowedDomains.includes(email.split('@')[1]), {
    message: 'Email domain is not allowed.',
    path: ['email'],
  })
  .refine(email => !email.includes('xn--'), {
    message: 'Punycode/Unicode in email addresses is not allowed.',
    path: ['email'],
  })

const PasswordSchema = z
  .string()
  .min(6, 'Password should be at least 6 characters long')
  .refine(password => /[A-Z]/.test(password), {
    message: 'Password should contain at least one uppercase letter',
    path: ['password'],
  })
  .refine(password => /[a-z]/.test(password), {
    message: 'Password should contain at least one lowercase letter',
    path: ['password'],
  })
  .refine(password => /[0-9]/.test(password), {
    message: 'Password should contain at least one digit',
    path: ['password'],
  })
// .refine(password => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password), {
//   message: 'Password should contain at least one special character',
//   path: ['password'],
// })
const CreateUserZodSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    middleName: z.string().optional(),
    lastName: z.string(),
    email: EmailSchema,
    phone: z.string(),
    profilePic: z.string().optional(),
    role: z.enum(['super_admin', 'admin', 'owner', 'renter']),
    preferredPropertyType: z.string().optional(),
    preferredAmenities: z.string().array().optional(),
    preferredLocation: z.string().optional(),
    searchHistory: z.string().array().optional(),
    socialMediaLink: z.string().array().optional(),
    userStatus: z.string().array().optional(),
    address: z.string().optional(),
    password: PasswordSchema,
    passwordChangedAt: z.date().optional(),
    createdAt: z.date().optional(),
    properties: z.array(z.any()).optional(),
    reviews: z.array(z.any()).optional(),
    bookings: z.array(z.any()).optional(),
    payments: z.array(z.any()).optional(),
    issues: z.array(z.any()).optional(),
    wishlists: z.array(z.any()).optional(),
    messageSent: z.array(z.any()).optional(),
    messageReceived: z.array(z.any()).optional(),
    notifications: z.array(z.any()).optional(),
    loyalties: z.array(z.any()).optional(),
    marketplaces: z.array(z.any()).optional(),
    insurances: z.array(z.any()).optional(),
  }),
})

const UserLoginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),

    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password is required to login',
    }),
  }),
})

const UserChangePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'OldPassword is required',
    }),

    newPassword: PasswordSchema,
  }),
})

const UserUpdateZodSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    middleName: z.string().optional(),
    lastName: z.string(),
    email: EmailSchema,
    phone: z.string(),
    profilePic: z.string().optional(),
    role: z.enum(['super_admin', 'admin', 'owner', 'renter']),
    preferredPropertyType: z.string().optional(),
    preferredAmenities: z.string().array().optional(),
    preferredLocation: z.string().optional(),
    searchHistory: z.string().array().optional(),
    socialMediaLink: z.string().array().optional(),
    userStatus: z.string().array().optional(),
    address: z.string().optional(),
    passwordChangedAt: z.date().optional(),
    createdAt: z.date().optional(),
    properties: z.array(z.any()).optional(),
    reviews: z.array(z.any()).optional(),
    bookings: z.array(z.any()).optional(),
    payments: z.array(z.any()).optional(),
    issues: z.array(z.any()).optional(),
    wishlists: z.array(z.any()).optional(),
    messageSent: z.array(z.any()).optional(),
    messageReceived: z.array(z.any()).optional(),
    notifications: z.array(z.any()).optional(),
    loyalties: z.array(z.any()).optional(),
    marketplaces: z.array(z.any()).optional(),
    insurances: z.array(z.any()).optional(),
  }),
})
export const UserValidation = {
  CreateUserZodSchema,
  UserLoginZodSchema,
  UserChangePasswordZodSchema,
  UserUpdateZodSchema,
}
