import { z } from 'zod'

const CreateIssueZodSchema = z.object({
  body: z.object({
    issueDescription: z.string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    }),
    issueStatus: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
    priorityLevel: z.enum(['Low', 'Medium', 'High']),

    propertyId: z.string().uuid(),
    renterId: z.string().uuid().optional(),
  }),
})

const UpdateIssueZodSchema = z.object({
  body: z.object({
    issueDescription: z
      .string({
        required_error: 'Description is required',
        invalid_type_error: 'Description must be a string',
      })
      .optional(),
    issueStatus: z
      .enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
      .optional(),
    priorityLevel: z.enum(['Low', 'Medium', 'High']).optional(),
  }),
})

export const IssueValidation = {
  CreateIssueZodSchema,
  UpdateIssueZodSchema,
}
