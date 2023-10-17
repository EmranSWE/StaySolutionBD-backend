/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { Review } from '@prisma/client'

export type IReviewFilterRequest = {
  searchTerm?: string | undefined
}

export type IPayload = {
  file?: Express.Multer.File | undefined
  user?: any
  body?: any
  review?: any
}

export interface UniqueQueryPayload {
  id: number | string
}

export type UpdateReviewPayload = Omit<Review, 'propertyId' | 'tenantId'>
