/* eslint-disable @typescript-eslint/ban-ts-comment */
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
const thisMonthTotalRents = async () => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1

  const result = await prisma.monthlyRentPayment.findMany({
    where: {
      month: currentMonth,
      year: currentDate.getFullYear(),
    },
  })

  // Calculate total amount
  const totalAmount = result.reduce(
    (acc, payment) => acc + (payment.amount ?? 0),
    0,
  )
  return totalAmount
}

const getMonthWiseMonthlyRentPayment = async () => {
  try {
    // Retrieve all payments from the database
    const payments = await prisma.monthlyRentPayment.findMany({
      where: {
        status: 'Completed', // Filter by 'Completed' status if necessary
      },
      select: {
        month: true,
        year: true,
        amount: true,
      },
    })

    // Group and sum payments by month and year
    const groupedPayments = payments.reduce((acc, payment) => {
      const monthYearKey = `${payment.year}-${payment.month
        .toString()
        .padStart(2, '0')}`
      //@ts-ignore
      if (!acc[monthYearKey]) {
        //@ts-ignore
        acc[monthYearKey] = 0
      }
      //@ts-ignore
      acc[monthYearKey] += payment.amount
      return acc
    }, {})

    // Convert grouped payments into an array for the response
    const result = Object.entries(groupedPayments).map(
      ([monthYear, totalAmount]) => {
        const [year, month] = monthYear.split('-')
        return {
          month,
          year,
          totalAmount,
        }
      },
    )
    return result
  } catch (error) {
    throw new ApiError(500, 'Error Found')
  }
}

//Get flat status details
const getFlatStatus = async () => {
  try {
    const properties = await prisma.property.findMany({
      select: {
        flatNo: true,
        propertyStatus: true,
      },
      orderBy: {
        flatNo: 'asc', // This will sort the results by flatNo in ascending order
      },
    })

    // Transform the data to the desired format
    const flatStatus = properties.map(property => ({
      flatNo: property.flatNo,
      status: property.propertyStatus,
    }))

    return flatStatus
  } catch (error) {
    throw new ApiError(500, 'Error Found')
  }
}

//Get flat status details
const getAllFlat = async () => {
  try {
    const properties = await prisma.property.findMany({
      select: {
        flatNo: true,
        id: true,
      },
      orderBy: {
        flatNo: 'asc',
      },
    })

    return properties
  } catch (error) {
    throw new ApiError(500, 'Error Found')
  }
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

//Get Single User total MonthlyRentPayment details
const singleUserTotalRentAmount = async (renterId: string) => {
  const totalRent = await prisma.monthlyRentPayment.findMany({
    where: {
      renterId: renterId,
    },
  })
  const totalAmount =
    totalRent.reduce((acc, payment) => acc + (payment.amount ?? 0), 0) || 0

  return totalAmount
}

//Get Single User total MonthlyRentPayment details
const singleOwnerTotalEarn = async (ownerId: string) => {
  const properties = await prisma.property.findMany({
    where: {
      ownerId: ownerId,
    },
    include: {
      monthlyRentPayments: true,
    },
  })

  let totalAmount = 0

  properties.forEach(property => {
    const monthlyRentPayments = property.monthlyRentPayments || []

    monthlyRentPayments.forEach(payment => {
      totalAmount += payment.amount || 0
    })
  })

  return totalAmount
}

//Get Single User total MonthlyRentPayment details
const singleOwnerTotalProperty = async (ownerId: string) => {
  const properties = await prisma.property.findMany({
    where: {
      ownerId: ownerId,
    },
  })

  const totalFlat = properties.length
  const totalBooked = properties.filter(
    property => property.propertyStatus === 'booked',
  ).length
  const totalAvailable = properties.filter(
    property => property.propertyStatus === 'available',
  ).length

  return {
    totalFlat: totalFlat,
    totalBooked: totalBooked,
    totalAvailable: totalAvailable,
  }
}

// Get total details of payment for a specific property
const getSpecificPropertyPaymentDetails = async (propertyId: any) => {
  if (!propertyId) {
    throw new Error('Property ID must be provided')
  }
  const totalRent = await prisma.monthlyRentPayment.findMany({
    where: {
      propertyId: propertyId,
    },
    select: {
      month: true,
      year: true,
      status: true,
      amount: true,
      paymentDate: true,
    },
  })

  return totalRent
}

const deleteMonthlyRentPayment = async (
  authUser: string | any,
  deletedId: any,
): Promise<any> => {
  const isSamePropertyPayment = await prisma.monthlyRentPayment.findUnique({
    where: {
      id: deletedId,
    },
  })

  // If the MonthlyRentPayment does not exist, throw an error.
  if (!isSamePropertyPayment) {
    throw new ApiError(404, 'MonthlyRentPayment not found')
  }
  const { role, id } = authUser

  if (
    isSamePropertyPayment.renterId !== id &&
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
  getSpecificPropertyPaymentDetails,
  addRegularMonthlyRentPayment,
  getSingleUserMonthlyRentPayment,
  deleteMonthlyRentPayment,
  getCurrentMonthPayments,
  getMonthWiseMonthlyRentPayment,
  getFlatStatus,
  getAllFlat,
  singleUserTotalRentAmount,
  thisMonthTotalRents,
  singleOwnerTotalEarn,
  singleOwnerTotalProperty,
}
