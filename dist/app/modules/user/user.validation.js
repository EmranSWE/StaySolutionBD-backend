"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const allowedDomains = [
    'gmail.com',
    'example.com',
    'yahoo.com ',
    'outlook.com',
    'icloud.com',
    'hotmail.com',
    'msn.com',
];
const blockedDomains = ['blocked.com'];
const disposableEmailProviders = ['mailinator.com', 'tempmail.com'];
const EmailSchema = zod_1.z
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
});
const PasswordSchema = zod_1.z
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
});
// .refine(password => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password), {
//   message: 'Password should contain at least one special character',
//   path: ['password'],
// })
const CreateUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string',
        }),
        middleName: zod_1.z.string().optional(),
        lastName: zod_1.z.string(),
        email: EmailSchema,
        phone: zod_1.z.string(),
        profilePic: zod_1.z.string().optional(),
        role: zod_1.z.enum(['super_admin', 'admin', 'owner', 'renter']),
        preferredPropertyType: zod_1.z.string().optional(),
        preferredAmenities: zod_1.z.string().array().optional(),
        preferredLocation: zod_1.z.string().optional(),
        searchHistory: zod_1.z.string().array().optional(),
        socialMediaLink: zod_1.z.string().array().optional(),
        userStatus: zod_1.z.string().array().optional(),
        address: zod_1.z.string().optional(),
        password: PasswordSchema,
        passwordChangedAt: zod_1.z.date().optional(),
        createdAt: zod_1.z.date().optional(),
        properties: zod_1.z.array(zod_1.z.any()).optional(),
        reviews: zod_1.z.array(zod_1.z.any()).optional(),
        bookings: zod_1.z.array(zod_1.z.any()).optional(),
        payments: zod_1.z.array(zod_1.z.any()).optional(),
        issues: zod_1.z.array(zod_1.z.any()).optional(),
        wishlists: zod_1.z.array(zod_1.z.any()).optional(),
        messageSent: zod_1.z.array(zod_1.z.any()).optional(),
        messageReceived: zod_1.z.array(zod_1.z.any()).optional(),
        notifications: zod_1.z.array(zod_1.z.any()).optional(),
        loyalties: zod_1.z.array(zod_1.z.any()).optional(),
        marketplaces: zod_1.z.array(zod_1.z.any()).optional(),
        insurances: zod_1.z.array(zod_1.z.any()).optional(),
    }),
});
const UserLoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
            invalid_type_error: 'Password is required to login',
        }),
    }),
});
const UserChangePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'OldPassword is required',
        }),
        newPassword: PasswordSchema,
    }),
});
const UserUpdateZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string',
        }),
        middleName: zod_1.z.string().optional(),
        lastName: zod_1.z.string(),
        email: EmailSchema,
        phone: zod_1.z.string(),
        profilePic: zod_1.z.string().optional(),
        role: zod_1.z.enum(['super_admin', 'admin', 'owner', 'renter']),
        preferredPropertyType: zod_1.z.string().optional(),
        preferredAmenities: zod_1.z.string().array().optional(),
        preferredLocation: zod_1.z.string().optional(),
        searchHistory: zod_1.z.string().array().optional(),
        socialMediaLink: zod_1.z.string().array().optional(),
        userStatus: zod_1.z.string().array().optional(),
        address: zod_1.z.string().optional(),
        passwordChangedAt: zod_1.z.date().optional(),
        createdAt: zod_1.z.date().optional(),
        properties: zod_1.z.array(zod_1.z.any()).optional(),
        reviews: zod_1.z.array(zod_1.z.any()).optional(),
        bookings: zod_1.z.array(zod_1.z.any()).optional(),
        payments: zod_1.z.array(zod_1.z.any()).optional(),
        issues: zod_1.z.array(zod_1.z.any()).optional(),
        wishlists: zod_1.z.array(zod_1.z.any()).optional(),
        messageSent: zod_1.z.array(zod_1.z.any()).optional(),
        messageReceived: zod_1.z.array(zod_1.z.any()).optional(),
        notifications: zod_1.z.array(zod_1.z.any()).optional(),
        loyalties: zod_1.z.array(zod_1.z.any()).optional(),
        marketplaces: zod_1.z.array(zod_1.z.any()).optional(),
        insurances: zod_1.z.array(zod_1.z.any()).optional(),
    }),
});
exports.UserValidation = {
    CreateUserZodSchema,
    UserLoginZodSchema,
    UserChangePasswordZodSchema,
    UserUpdateZodSchema,
};
