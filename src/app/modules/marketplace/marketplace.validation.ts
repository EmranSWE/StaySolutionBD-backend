// import { z } from 'zod'

// const CreatePropertyZodSchema = z.object({
//   body: z.object({
//     itemDescription: z.string({
//       required_error: 'Description is required',
//       invalid_type_error: 'Name must be a string',
//     }),
//     middleName: z.string().optional(),
//     lastName: z.string(),

//     phone: z.string(),
//     profilePic: z.string().optional(),
//     role: z.enum(['super_admin', 'admin', 'owner', 'renter']),
//     preferredPropertyType: z.string().optional(),
//     preferredAmenities: z.string().array().optional(),
//     preferredLocation: z.string().optional(),
//     searchHistory: z.string().array().optional(),
//     socialMediaLink: z.string().array().optional(),
//     userStatus: z.string().array().optional(),
//     address: z.string().optional(),
//     password: PasswordSchema,
//     passwordChangedAt: z.date().optional(),
//     createdAt: z.date().optional(),
//     properties: z.array(z.any()).optional(),
//     reviews: z.array(z.any()).optional(),
//     bookings: z.array(z.any()).optional(),
//     payments: z.array(z.any()).optional(),
//     issues: z.array(z.any()).optional(),
//     wishlists: z.array(z.any()).optional(),
//     messageSent: z.array(z.any()).optional(),
//     messageReceived: z.array(z.any()).optional(),
//     notifications: z.array(z.any()).optional(),
//     loyalties: z.array(z.any()).optional(),
//     marketplaces: z.array(z.any()).optional(),
//     insurances: z.array(z.any()).optional(),
//   }),
// })

// const UserLoginZodSchema = z.object({
//   body: z.object({
//     email: z.string({
//       required_error: 'Email is required',
//     }),

//     password: z.string({
//       required_error: 'Password is required',
//       invalid_type_error: 'Password is required to login',
//     }),
//   }),
// })

// const UserChangePasswordZodSchema = z.object({
//   body: z.object({
//     oldPassword: z.string({
//       required_error: 'OldPassword is required',
//     }),

//     newPassword: PasswordSchema,
//   }),
// })

// const UserUpdateZodSchema = z.object({
//   body: z.object({
//     firstName: z.string({
//       required_error: 'Name is required',
//       invalid_type_error: 'Name must be a string',
//     }),
//     middleName: z.string().optional(),
//     lastName: z.string(),
//     email: EmailSchema,
//     phone: z.string(),
//     profilePic: z.string().optional(),
//     role: z.enum(['super_admin', 'admin', 'owner', 'renter']),
//     preferredPropertyType: z.string().optional(),
//     preferredAmenities: z.string().array().optional(),
//     preferredLocation: z.string().optional(),
//     searchHistory: z.string().array().optional(),
//     socialMediaLink: z.string().array().optional(),
//     userStatus: z.string().array().optional(),
//     address: z.string().optional(),
//     passwordChangedAt: z.date().optional(),
//     createdAt: z.date().optional(),
//     properties: z.array(z.any()).optional(),
//     reviews: z.array(z.any()).optional(),
//     bookings: z.array(z.any()).optional(),
//     payments: z.array(z.any()).optional(),
//     issues: z.array(z.any()).optional(),
//     wishlists: z.array(z.any()).optional(),
//     messageSent: z.array(z.any()).optional(),
//     messageReceived: z.array(z.any()).optional(),
//     notifications: z.array(z.any()).optional(),
//     loyalties: z.array(z.any()).optional(),
//     marketplaces: z.array(z.any()).optional(),
//     insurances: z.array(z.any()).optional(),
//   }),
// })
// export const PropertyValidation = {
//   CreatePropertyZodSchema,
// }
