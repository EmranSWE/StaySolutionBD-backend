import { Review } from '@prisma/client'

export type IPropertyFilterRequest = {
  searchTerm?: string | undefined
}

export interface UniqueQueryPayload {
  id: number | string
}

export type UpdateReviewPayload = Omit<Review, 'propertyId' | 'tenantId'>
