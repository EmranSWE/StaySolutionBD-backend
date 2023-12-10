/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Booking, Prisma, Property, Review } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import {
  IBookingFilterRequest,
  UpdateBookingResponse,
} from './booking.interface'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'

import { getUniqueRecord } from '../../utils/utils'
import {
  BookingRelationalFields,
  BookingRelationalFieldsMapper,
  BookingSearchableFields,
} from './booking.constant'

const addBooking = async (payload: any) => {
  const { user, body } = payload
  // Authorization check: Ensure user has the 'owner' role
  const { role } = user
  if (role !== 'renter') {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }

  if (body.bookingEndDate && body.bookingEndDate < body.bookingStartDate) {
    return {
      success: false,
      error: 'Booking end date cannot be set before the booking start date',
    }
  }
  if (!body.bookingEndDate) {
    const startDate = new Date(body.bookingStartDate)
    startDate.setMonth(startDate.getMonth() + 12)
    body.bookingEndDate = startDate
  }
  // Prepare Booking data with the uploaded image URL
  const updatedData = {
    ...body,
    renterId: user.id,
  }

  // Create a new Booking record in the database using Prisma
  const result = await prisma.booking.create({
    data: updatedData,
  })

  // Return the created Booking data
  return { success: true, data: result }
}

const getBookings = async (
  filters: IBookingFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Booking[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)

  const { searchTerm, bookingStatus, bookingStartDate, ...filterData } = filters
  const andConditions = []

  // Handling search term
  if (searchTerm) {
    andConditions.push({
      OR: BookingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  if (bookingStatus) {
    andConditions.push({ bookingStatus: bookingStatus })
  }
  // Handling available after date
  if (bookingStartDate) {
    andConditions.push({ bookingStartDate: { gte: bookingStartDate } })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (BookingRelationalFields.includes(key)) {
          return {
            [BookingRelationalFieldsMapper[key]]: {
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

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.booking.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            bookingStartDate: 'desc',
          },
    include: {
      property: true,
    },
  })
  const total = await prisma.booking.count({
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

const getSingleBooking = async (payload: any) => {
  const model = prisma.booking
  const result = await getUniqueRecord(model, payload)
  return result
}

const getSingleUserBooking = async (userId: any) => {
  const result = await prisma.booking.findMany({
    where: {
      renterId: userId,
    },
    include: {
      property: true,
    },
  })
  return result
}

//Update Booking
const updateBooking = async (payload: any): Promise<UpdateBookingResponse> => {
  if (!payload.params?.id || !payload.user?.id) {
    return { success: false, error: 'Invalid input or file is missing' }
  }
  const { params, user, body } = payload
  const { id: BookingId } = params
  const { role } = user

  if (role !== 'admin' && role !== 'owner') {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }
  const { bookingStatus } = body

  const result = await prisma.booking.update({
    where: { id: BookingId },
    data: { bookingStatus: bookingStatus },
  })
  return { success: true, data: result }
}
const deleteBooking = async (
  authUser: string | any,
  deletedId: any,
): Promise<any> => {
  // First, check if the Booking exists
  const isBooked = await prisma.booking.findUnique({
    where: {
      id: deletedId,
    },
  })

  if (!isBooked) {
    throw new ApiError(404, 'Booking not found')
  }

  const { role, id } = authUser

  // Check permissions
  if (isBooked.renterId !== id && role !== 'admin' && role !== 'owner') {
    throw new ApiError(400, "You haven't permission to delete the Booking")
  }

  // Update the property status first in case booking deletion fails
  await prisma.property.update({
    where: {
      id: isBooked?.propertyId,
    },
    data: {
      propertyStatus: 'available',
    },
  })

  // Now delete the booking
  const result = await prisma.booking.delete({
    where: {
      id: deletedId,
    },
  })

  return { success: true, data: result }
}

export const BookingService = {
  addBooking,
  getBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
  getSingleUserBooking,
}
