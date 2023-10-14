/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, Review } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { IReviewFilterRequest, UniqueQueryPayload } from './review.interface'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import {
  reviewRelationalFields,
  reviewSearchableFields,
} from './review.constant'
import { getUniqueRecord, updateRecord } from '../../utils/utils'

const addReview = async (payload: Review) => {
  if (payload.rating > 5) {
    throw new ApiError(400, 'User rating between 1 to 5')
  }
  const reviewData = await prisma.review.create({ data: payload })

  return reviewData
}

const getAllReviews = async (
  filters: IReviewFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Review[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm, ...filterData } = filters

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      OR: reviewSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (reviewRelationalFields.includes(key)) {
          return {
            //@ts-ignore
            [reviewRelationalFields[key]]: {
              id: (filterData as any)[key],
            },
          }
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          }
        }
      }),
    })
  }

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            rating: 'desc',
          },
  })
  const total = await prisma.review.count({
    where: whereConditions,
  })

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  }
}

const getSingleReview = async (payload: any) => {
  const model = prisma.review
  const result = getUniqueRecord(model, payload)
  return result
}

const updateReview = async (authId: any, reviewId: any, payload: Review) => {
  const { propertyId, tenantId, ...safePayload } = payload
  const existingReview = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  })

  if (existingReview?.tenantId !== authId) {
    throw new ApiError(400, "You haven't permission to change the review")
  }
  if (propertyId && tenantId) {
    throw new ApiError(400, "You can't change the foreign key")
  }
  const result = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: safePayload,
  })
  return result
}

const deleteReview = async (authId: any, deletedId: any) => {
  const isSameUser = await prisma.review.findUnique({
    where: {
      id: deletedId,
    },
  })

  // If the review does not exist, throw an error.
  if (!isSameUser) {
    throw new ApiError(404, 'Review not found')
  }

  if (isSameUser?.tenantId !== authId) {
    throw new ApiError(400, "You haven't permission to change the review")
  }

  const result = await prisma.review.delete({
    where: {
      id: deletedId,
    },
  })

  return result
}

const singleUserReview = async (userId: any) => {
  const allReviews = await prisma.review.findMany({
    where: {
      tenantId: userId,
    },
  })

  // If the review does not exist, throw an error.
  if (!allReviews) {
    throw new ApiError(404, 'Review not found')
  }

  return allReviews
}
const singlePropertiesRating = async (propertyId: any) => {
  const propertyAvgRating = await prisma.review.aggregate({
    where: {
      propertyId: propertyId,
    },
    _avg: {
      rating: true,
    },
  })

  const averageRating = propertyAvgRating._avg.rating

  // If there's no average rating (e.g. no reviews exist), handle it appropriately.
  if (averageRating === null) {
    throw new ApiError(404, 'Review not found')
  }

  const avgRate = Math.round(averageRating)

  return avgRate // return the rounded value
}
export const ReviewService = {
  addReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  singleUserReview,
  singlePropertiesRating,
}
