import { Review } from '@prisma/client'

export type IReviewFilterRequest = {
  searchTerm?: string | undefined
}

export type UserUpdateInput = {
  password: string
  passwordChangedAt: Date
}

export interface UniqueQueryPayload {
  id: number | string
}

export type UpdateReviewPayload = Omit<Review, 'propertyId' | 'tenantId'>
