/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiError from '../../../errors/ApiError'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import prisma from '../../../shared/prisma'
import { IMonthlyRentPaymentFilterRequest } from './monthlyRentPayment.interface'
import { Booking, MonthlyRentPayment } from '@prisma/client'
import {
  MonthlyRentPaymentRelationalFields,
  MonthlyRentPaymentRelationalFieldsMapper,
  MonthlyRentPaymentSearchableFields,
} from './monthlyRentPayment.constant'
import { getUpcomingPaymentMonths } from './monthlyRentPayments.utils'

const addMonthlyRentPayment = async (payload: any) => {
  const { user, body } = payload
  const { id: userId } = user
  const { bookingId, ...rest } = body
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  })

  const propertyId = booking?.propertyId

  // Prepare MonthlyRentPayment data with the uploaded image URL
  const updatedData = {
    ...rest,
    propertyId: propertyId,
    renterId: userId,
  }

  // Create a new MonthlyRentPayment record in the database using Prisma
  const result = await prisma.monthlyRentPayment.create({
    data: updatedData,
  })

  // Check if the payment is completed (you need to implement this logic)
  const paymentCompleted = true // You need to set this based on your payment gateway logic

  if (paymentCompleted) {
    // Update the bookingStatus to 'confirmed' and propertyStatus to 'booked'
    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        bookingStatus: 'Confirmed',
      },
    })

    // Assuming you have a 'property' field in the 'booking' table that you want to update
    await prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        propertyStatus: 'booked',
      },
    })
  }

  // Return the created MonthlyRentPayment data
  return { success: true, data: result }
}

const addRegularMonthlyRentPayment = async (payload: any) => {
  const { user, body } = payload
  const { id: renterId } = user
  const { bookingId, ...rest } = body
  const updatedData = {
    ...rest,
    renterId: renterId,
  }

  // Create a new MonthlyRentPayment record in the database using Prisma
  const result = await prisma.monthlyRentPayment.create({
    data: updatedData,
  })
  // Return the created MonthlyRentPayment data
  return { success: true, data: result }
}

//Get all MonthlyRentPayments
const getMonthlyRentPayments = async (
  filters: IMonthlyRentPaymentFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<MonthlyRentPayment[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)

  const {
    searchTerm,
    MonthlyRentPaymentStatus,
    MonthlyRentPaymentAmount,
    ...filterData
  } = filters

  const andConditions = []

  // Handling search term
  if (searchTerm) {
    andConditions.push({
      OR: MonthlyRentPaymentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  // Handling number of rooms
  const MonthlyRentPaymentAmountInt = Number(MonthlyRentPaymentAmount)

  if (!isNaN(MonthlyRentPaymentAmountInt)) {
    // Check if the parsed value is a valid number
    andConditions.push({
      MonthlyRentPaymentAmount: MonthlyRentPaymentAmountInt,
    })
  }
  if (MonthlyRentPaymentStatus) {
    andConditions.push({ MonthlyRentPaymentStatus: MonthlyRentPaymentStatus })
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (MonthlyRentPaymentRelationalFields.includes(key)) {
          return {
            [MonthlyRentPaymentRelationalFieldsMapper[key]]: {
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

  const result = await prisma.monthlyRentPayment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            amount: 'desc',
          },
    include: {
      property: true,
    },
  })
  const total = await prisma.monthlyRentPayment.count({
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

//Get single MonthlyRentPayment details
const getSingleMonthlyRentPayment = async (payload: any) => {
  const result = await prisma.monthlyRentPayment.findUnique({
    where: {
      id: payload,
    },
    include: {
      renter: true,
      property: true,
    },
  })
  return result
}

//Get single MonthlyRentPayment details
const getSingleUserMonthlyRentPayment = async (renterId: any) => {
  const result = await prisma.monthlyRentPayment.findMany({
    where: {
      renterId: renterId,
    },
    select: {
      month: true,
      year: true,
      status: true,
      amount: true,
    },
  })

  return result
}

//Get total MonthlyRentPayment details
const getTotalMonthlyRentPayment = async () => {
  const totalRent = await prisma.monthlyRentPayment.aggregate({
    _sum: {
      amount: true,
    },
  })
  return totalRent._sum.amount || 0
}

// Get total rent amount for a specific property
const getSpecificPropertyTotalPayment = async (propertyId: any) => {
  if (!propertyId) {
    throw new Error('Property ID must be provided')
  }

  const totalRent = await prisma.monthlyRentPayment.aggregate({
    where: {
      propertyId: propertyId,
    },
    _sum: {
      amount: true,
    },
  })

  return totalRent._sum.amount || 0
}
//Update MonthlyRentPayment
// const updateMonthlyRentPayment = async (
//   payload: any,
// ): Promise<UpdateMonthlyRentPaymentResponse> => {
//   if (!payload.params?.id || !payload.user?.id) {
//     return { success: false, error: 'Invalid input or file is missing' }
//   }
//   const { params, user, body } = payload
//   const { id: MonthlyRentPaymentId } = params
//   const { role } = user

//   if (role !== 'admin' && role !== 'owner') {
//     return {
//       success: false,
//       error: 'Unauthorized: You cannot update this user',
//     }
//   }
//   const { MonthlyRentPaymentStatus } = body

//   const result = await prisma.MonthlyRentPayment.update({
//     where: { id: MonthlyRentPaymentId },
//     data: { MonthlyRentPaymentStatus: MonthlyRentPaymentStatus },
//   })
//   return { success: true, data: result }
// }

const deleteMonthlyRentPayment = async (
  authUser: string | any,
  deletedId: any,
): Promise<any> => {
  const isSameUser = await prisma.monthlyRentPayment.findUnique({
    where: {
      id: deletedId,
    },
  })

  // If the MonthlyRentPayment does not exist, throw an error.
  if (!isSameUser) {
    throw new ApiError(404, 'MonthlyRentPayment not found')
  }
  const { role, id } = authUser

  if (
    isSameUser.renterId !== id &&
    role !== 'admin' &&
    role !== 'super_admin'
  ) {
    throw new ApiError(
      400,
      "You haven't permission to delete the MonthlyRentPayment",
    )
  }

  const result = await prisma.monthlyRentPayment.delete({
    where: {
      id: deletedId,
    },
  })
  return result
}

// Get Upcoming month payment details
export const getCurrentMonthPayments = async (propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      bookings: true,
      monthlyRentPayments: true,
    },
  })

  if (!property || property.propertyStatus !== 'booked') {
    return 'No confirmed bookings found for this property.'
  }

  const confirmedBooking = property.bookings.find(
    (booking: Booking) => booking.bookingStatus === 'Confirmed',
  )
  if (!confirmedBooking) {
    return 'No confirmed bookings found.'
  }

  // Assuming monthlyRentPayments are sorted by date in descending order
  const latestPayment =
    property.monthlyRentPayments[property.monthlyRentPayments.length - 1]

  if (!latestPayment || latestPayment.status !== 'Completed') {
    return 'Latest payment is not completed or no payments found.'
  }
  const remainingMonthsForPayment = getUpcomingPaymentMonths(latestPayment)
  return remainingMonthsForPayment
}

export const MonthlyRentPaymentService = {
  addMonthlyRentPayment,
  getMonthlyRentPayments,
  getSingleMonthlyRentPayment,
  getTotalMonthlyRentPayment,
  getSpecificPropertyTotalPayment,
  addRegularMonthlyRentPayment,
  getSingleUserMonthlyRentPayment,
  deleteMonthlyRentPayment,
  getCurrentMonthPayments,
}
