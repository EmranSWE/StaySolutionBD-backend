/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, Feedback } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import { IPayload } from './feedback..interface'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'

import { getUniqueRecord } from '../../utils/utils'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'

const addFeedback = async (payload: IPayload) => {
  const { user, body } = payload
  // Authorization check: Ensure user has the 'renter' role
  const { role, id } = user
  if (role !== 'renter' && role !== 'owner') {
    return {
      success: false,
      error: 'Unauthorized: You can only add a Feedback as a renter or owner',
    }
  }

  // Prepare property data with the uploaded image URL
  const updatedData = {
    ...body,
    userId: id,
  }

  const result = await prisma.feedback.create({
    data: updatedData,
  })
  return { success: true, data: result }
}

const getAllFeedbacks = async (
  options: IPaginationOptions,
): Promise<IGenericResponse<Feedback[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)

  const result = await prisma.feedback.findMany({
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            rating: 'desc',
          },
    include: {
      user: true,
    },
  })
  const total = await prisma.feedback.count({})

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  }
}

// const getAllFeedbacks = async () => {
//   const result = await prisma.Feedback.findMany({
//     where: whereConditions,
//   })

//   return result
// }

// const getSingleFeedback = async (payload: any) => {
//   const model = prisma.Feedback
//   const result = getUniqueRecord(model, payload)
//   return result
// }

// const updateFeedback = async (payload: IPayload) => {
//   const { file, user, body, Feedback } = payload
//   // Validate file input
//   if (!file) {
//     return { success: false, error: 'Invalid input or file is missing' }
//   }

//   // Authorization check: Ensure user has the 'owner' role
//   const { role } = user
//   if (role !== 'renter') {
//     return {
//       success: false,
//       error: 'Unauthorized: You cannot update this user',
//     }
//   }

//   // Prepare property data with the uploaded image URL
//   const updatedData = {
//     ...body,
//   }
//   const id = Feedback.id
//   // Create a new property record in the database using Prisma
//   const result = await prisma.Feedback.update({
//     where: { id: id },
//     data: updatedData,
//   })

//   // Return the created property data
//   return { success: true, data: result }
// }

const deleteFeedback = async (authId: any, deletedId: any) => {
  // const isSameUser = await prisma.Feedback.findUnique({
  //   where: {
  //     id: deletedId,
  //   },
  // })

  // // If the Feedback does not exist, throw an error.
  // if (!isSameUser) {
  //   throw new ApiError(404, 'Feedback not found')
  // }

  // if (isSameUser?.renterId !== authId) {
  //   throw new ApiError(400, "You haven't permission to change the Feedback")
  // }

  const result = await prisma.feedback.delete({
    where: {
      id: deletedId,
    },
  })

  return result
}

// const singleUserFeedback = async (userId: any) => {
//   const allFeedbacks = await prisma.Feedback.findMany({
//     where: {
//       renterId: userId,
//     },
//   })

//   // If the Feedback does not exist, throw an error.
//   if (!allFeedbacks) {
//     throw new ApiError(404, 'Feedback not found')
//   }

//   return allFeedbacks
// }
// const singlePropertiesRating = async (propertyId: any) => {
//   const propertyAvgRating = await prisma.Feedback.aggregate({
//     where: {
//       propertyId: propertyId,
//     },
//     _avg: {
//       rating: true,
//     },
//   })

//   const averageRating = propertyAvgRating._avg.rating

//   // If there's no average rating (e.g. no Feedbacks exist), handle it appropriately.
//   if (averageRating === null) {
//     throw new ApiError(404, 'Feedback not found')
//   }

//   const avgRate = Math.round(averageRating)

//   return avgRate // return the rounded value
// }
export const FeedbackService = {
  addFeedback,
  getAllFeedbacks,
  // getSingleFeedback,
  // updateFeedback,
  deleteFeedback,
  // singleUserFeedback,
  // singlePropertiesRating,
}
