/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, Review } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import { IPayload, IReviewFilterRequest } from './review.interface'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import {
  reviewRelationalFields,
  reviewSearchableFields,
} from './review.constant'
import { getUniqueRecord } from '../../utils/utils'
import { ICloudinaryResponse, IUploadFile } from '../../../interface/file'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'

const addReview = async (payload: IPayload) => {
  const { file, user, body } = payload
  // Validate file input
  if (!file) {
    return { success: false, error: 'Invalid input or file is missing' }
  }

  // Authorization check: Ensure user has the 'renter' role
  const { role } = user
  if (role !== 'renter') {
    return {
      success: false,
      error: 'Unauthorized: You can only add a review as a renter',
    }
  }

  // Upload Marketplace image to Cloudinary using the stream approach
  const uploadedImage: ICloudinaryResponse =
    await FileUploadHelper.uploadToCloudinary(file.buffer)
  if (!uploadedImage?.secure_url) {
    return { success: false, error: 'Failed to upload image' }
  }

  // Prepare property data with the uploaded image URL
  const updatedData = {
    ...body,
    reviewPic: [uploadedImage.secure_url],
    property: {
      connect: {
        id: body.propertyId,
      },
    },
    renter: {
      connect: {
        id: user?.id, // Assuming the renter is the authenticated user
      },
    },
  }

  // Remove the direct `propertyId` and `renterId` as they're not needed anymore
  delete updatedData.propertyId
  delete updatedData.renterId

  // Create a new review record in the database using Prisma
  const result = await prisma.review.create({
    data: updatedData,
  })

  // Return the created review data
  return { success: true, data: result }
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

const updateReview = async (payload: IPayload) => {
  const { file, user, body, review } = payload
  // Validate file input
  if (!file) {
    return { success: false, error: 'Invalid input or file is missing' }
  }

  // Authorization check: Ensure user has the 'owner' role
  const { role } = user
  if (role !== 'renter') {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }

  // Upload Marketplace image to Cloudinary using the stream approach
  const uploadedImage: ICloudinaryResponse =
    await FileUploadHelper.uploadToCloudinary(file.buffer)
  if (!uploadedImage?.secure_url) {
    return { success: false, error: 'Failed to upload image' }
  }

  // Prepare property data with the uploaded image URL
  const updatedData = {
    ...body,
    reviewPic: [uploadedImage.secure_url],
  }
  const id = review.id
  // Create a new property record in the database using Prisma
  const result = await prisma.review.update({
    where: { id: id },
    data: updatedData,
  })

  // Return the created property data
  return { success: true, data: result }
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

  if (isSameUser?.renterId !== authId) {
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
      renterId: userId,
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
