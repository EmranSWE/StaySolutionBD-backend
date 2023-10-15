/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, Booking } from '@prisma/client'
import prisma from '../../../shared/prisma'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'
import {
  ICloudinaryResponse,
  IUploadFiel,
  IUploadFile,
} from '../../../interface/file'
// import ApiError from '../../../errors/ApiError'
// import { IPaginationOptions } from '../../../interface/pagination'
// import { IGenericResponse } from '../../../interface/common'
// import { paginationHelpers } from '../../../helpers/paginationHelper'

// import { getUniqueRecord } from '../../utils/utils'
// import { IBookingFilterRequest } from './Booking.interface'
// import {
//   BookingRelationalFields,
//   BookingSearchableFields,
// } from './Booking.constant'

const addBooking = async payload => {
  if (!payload || !payload.file) {
    return { success: false, error: 'Payload or file is missing' }
  }

  const files = payload.file as IUploadFile

  const uploadedImage: ICloudinaryResponse =
    await FileUploadHelper.uploadToCloudinary(files)
  if (!uploadedImage) {
    return { success: false, error: 'Failed to upload image' }
  }

  payload.body.profileImage = uploadedImage.secure_url

  const result = await prisma.booking.create({
    data: payload.body,
  })

  return { success: true, data: result }
}
// const getAllProperties = async (
//   filters: IBookingFilterRequest,
//   options: IPaginationOptions,
// ): Promise<IGenericResponse<Booking[]>> => {
//   const { limit, page, skip } = paginationHelpers.calculatePagination(options)
//   const { searchTerm, ...filterData } = filters
//   console.log(searchTerm)
//   const andConditions = []

//   if (searchTerm) {
//     andConditions.push({
//       OR: BookingSearchableFields.map(field => ({
//         [field]: {
//           contains: searchTerm,
//           mode: 'insensitive',
//         },
//       })),
//     })
//   }
//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map(key => {
//         if (BookingRelationalFields.includes(key)) {
//           return {
//             //@ts-ignore
//             [BookingRelationalFields[key]]: {
//               id: (filterData as any)[key],
//             },
//           }
//         } else {
//           return {
//             [key]: {
//               equals: (filterData as any)[key],
//             },
//           }
//         }
//       }),
//     })
//   }

//   const whereConditions: Prisma.BookingWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {}

//   const result = await prisma.Booking.findMany({
//     where: whereConditions,
//     skip,
//     take: limit,
//     orderBy:
//       options.sortBy && options.sortOrder
//         ? { [options.sortBy]: options.sortOrder }
//         : {
//             monthlyRent: 'desc',
//           },
//   })
//   const total = await prisma.Booking.count({
//     where: whereConditions,
//   })

//   return {
//     meta: {
//       total,
//       page,
//       limit,
//     },
//     data: result,
//   }
// }

// const getSingleBooking = async (payload: any) => {
//   const model = prisma.Booking
//   const result = getUniqueRecord(model, payload)
//   return result
// }

// const updateBooking = async (
//   authId: any,
//   BookingId: any,
//   payload: Booking,
// ) => {
//   const { BookingId, tenantId, ...safePayload } = payload
//   const existingBooking = await prisma.Booking.findUnique({
//     where: {
//       id: BookingId,
//     },
//   })

//   if (existingBooking?.tenantId !== authId) {
//     throw new ApiError(400, "You haven't permission to change the Booking")
//   }
//   if (BookingId && tenantId) {
//     throw new ApiError(400, "You can't change the foreign key")
//   }
//   const result = await prisma.Booking.update({
//     where: {
//       id: BookingId,
//     },
//     data: safePayload,
//   })
//   return result
// }

// const deleteBooking = async (authId: any, deletedId: any) => {
//   const isSameUser = await prisma.Booking.findUnique({
//     where: {
//       id: deletedId,
//     },
//   })

//   // If the Booking does not exist, throw an error.
//   if (!isSameUser) {
//     throw new ApiError(404, 'Booking not found')
//   }

//   if (isSameUser?.tenantId !== authId) {
//     throw new ApiError(400, "You haven't permission to change the Booking")
//   }

//   const result = await prisma.Booking.delete({
//     where: {
//       id: deletedId,
//     },
//   })

//   return result
// }

// const singleUserBooking = async (userId: any) => {
//   const allBookings = await prisma.Booking.findMany({
//     where: {
//       tenantId: userId,
//     },
//   })

//   // If the Booking does not exist, throw an error.
//   if (!allBookings) {
//     throw new ApiError(404, 'Booking not found')
//   }

//   return allBookings
// }
// const singlePropertiesRating = async (BookingId: any) => {
//   const BookingAvgRating = await prisma.Booking.aggregate({
//     where: {
//       BookingId: BookingId,
//     },
//     _avg: {
//       rating: true,
//     },
//   })

//   const averageRating = BookingAvgRating._avg.rating

//   // If there's no average rating (e.g. no Bookings exist), handle it appropriately.
//   if (averageRating === null) {
//     throw new ApiError(404, 'Booking not found')
//   }

//   const avgRate = Math.round(averageRating)

//   return avgRate // return the rounded value
// }
export const BookingService = {
  addBooking,
  //   getAllProperties,
  // getSingleBooking,
  // updateBooking,
  // deleteBooking,
  // singleUserBooking,
  // singlePropertiesRating,
}
