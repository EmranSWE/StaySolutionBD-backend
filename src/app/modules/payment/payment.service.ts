/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, Payment, Review } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'

import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'

import { getUniqueRecord } from '../../utils/utils'
import {
  IPaymentFilterRequest,
  UpdatePaymentResponse,
} from './payment.interface'
import {
  paymentRelationalFields,
  paymentRelationalFieldsMapper,
  paymentSearchableFields,
} from './payment.constant'

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
  apiVersion: '2020-08-27' as any,
})

const addPayment = async (payload: any) => {
  const { user, body } = payload
  // Authorization check: Ensure user has the 'owner' role
  const { role, id: userId } = user
  if (role !== 'renter') {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }

  // Prepare Payment data with the uploaded image URL
  const updatedData = {
    ...body,
    renterId: userId,
  }

  // Create a new Payment record in the database using Prisma
  const result = await prisma.payment.create({
    data: updatedData,
  })

  // Return the created Payment data
  return { success: true, data: result }
}

const addPaymentStripe = async (payload: any) => {
  const { user, body } = payload
  const { token, paymentId } = body

  const { role, id: userId } = user
  if (role !== 'renter') {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      property: true,
      renter: true,
    },
  })

  //@ts-ignore
  const { description, monthlyRent } = booking?.property

  const stripeCustomer = await stripe.customers.create({
    //@ts-ignore
    email: user.email as string,
    source: token, //
    address: {
      city: 'Imran',
      country: 'Bangladesh',
      line1: 'Arshinagr',
      line2: null,
      postal_code: '10001',
      state: 'dhaka',
    },
    shipping: {
      name: 'Imran',
      address: {
        city: 'Dhaka',
        country: null,
        line1: 'KK 137 ST',
        line2: null,
        postal_code: '10001',
        state: null,
      },
    },
    name: 'imran',
    phone: '01838235450',
  })
  // CREATE STRIPE CHARGE
  const stripeCharge = await stripe.charges.create({
    amount: monthlyRent * 100,
    currency: 'usd',
    customer: stripeCustomer.id,
    description: `Purchased the ${description} for ${monthlyRent}`,
  })

  const updateStatus = {
    bookingStatus: 'Confirmed' as any,
  }

  if (stripeCharge.status === 'succeeded') {
    const result = await prisma.booking.update({
      where: { id: paymentId },
      data: updateStatus,
    })
    return { success: true, data: result }
  }
}

//Get all payments
const getPayments = async (
  filters: IPaymentFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Payment[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)

  const { searchTerm, paymentStatus, paymentAmount, ...filterData } = filters

  const andConditions = []

  // Handling search term
  if (searchTerm) {
    andConditions.push({
      OR: paymentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  // Handling number of rooms
  const paymentAmountInt = Number(paymentAmount)

  if (!isNaN(paymentAmountInt)) {
    // Check if the parsed value is a valid number
    andConditions.push({ paymentAmount: paymentAmountInt })
  }
  if (paymentStatus) {
    andConditions.push({ paymentStatus: paymentStatus })
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (paymentRelationalFields.includes(key)) {
          return {
            [paymentRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.PaymentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            paymentAmount: 'desc',
          },
  })
  const total = await prisma.payment.count({
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

const getAllRent = async (
  filters: IPaymentFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Payment[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)

  const { searchTerm, paymentStatus, paymentAmount, ...filterData } = filters

  const andConditions = []

  // Handling search term
  if (searchTerm) {
    andConditions.push({
      OR: paymentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  // Handling number of rooms
  const paymentAmountInt = Number(paymentAmount)

  if (!isNaN(paymentAmountInt)) {
    // Check if the parsed value is a valid number
    andConditions.push({ paymentAmount: paymentAmountInt })
  }
  if (paymentStatus) {
    andConditions.push({ paymentStatus: paymentStatus })
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (paymentRelationalFields.includes(key)) {
          return {
            [paymentRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.PaymentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            paymentAmount: 'desc',
          },
    include: {
      booking: {
        include: {
          property: true,
        },
      },
    },
  })

  type PaymentGroup = {
    flatNo: string | null
    paymentStatus: string
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  // Define the type for groupedByMonth
  const groupedByMonth: Record<string, PaymentGroup[]> = {}

  result.forEach(payment => {
    const paymentDate = new Date(payment.paymentDate)
    const month = monthNames[paymentDate.getMonth()]

    if (!groupedByMonth[month]) {
      groupedByMonth[month] = []
    }

    groupedByMonth[month].push({
      flatNo: payment.booking?.property?.flatNo || null,
      paymentStatus: payment.paymentStatus,
    })
  })

  // console.log(result.booking.bookingId)
  const total = await prisma.payment.count({
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
//Get single payment details
const getSinglePayment = async (payload: any) => {
  const model = prisma.payment
  const result = await getUniqueRecord(model, payload)
  return result
}

//Update Payment
const updatePayment = async (payload: any): Promise<UpdatePaymentResponse> => {
  if (!payload.params?.id || !payload.user?.id) {
    return { success: false, error: 'Invalid input or file is missing' }
  }
  const { params, user, body } = payload
  const { id: PaymentId } = params
  const { role } = user

  if (role !== 'admin' && role !== 'owner') {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }
  const { paymentStatus } = body

  const result = await prisma.payment.update({
    where: { id: PaymentId },
    data: { paymentStatus: paymentStatus },
  })
  return { success: true, data: result }
}
const deletePayment = async (
  authUser: string | any,
  deletedId: any,
): Promise<any> => {
  const isSameUser = await prisma.payment.findUnique({
    where: {
      id: deletedId,
    },
  })

  // If the Payment does not exist, throw an error.
  if (!isSameUser) {
    throw new ApiError(404, 'Payment not found')
  }
  const { role, id } = authUser

  if (
    isSameUser.renterId !== id &&
    role !== 'admin' &&
    role !== 'super_admin'
  ) {
    throw new ApiError(400, "You haven't permission to delete the Payment")
  }

  const result = await prisma.payment.delete({
    where: {
      id: deletedId,
    },
  })

  return result
}
export const PaymentService = {
  addPayment,
  addPaymentStripe,
  getPayments,
  getSinglePayment,
  updatePayment,
  deletePayment,
  getAllRent,
}
