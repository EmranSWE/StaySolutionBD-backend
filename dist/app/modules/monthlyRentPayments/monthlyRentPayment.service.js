'use strict'
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {}
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p]
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]]
      }
    return t
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.MonthlyRentPaymentService = void 0
const paginationHelper_1 = require('../../../helpers/paginationHelper')
const prisma_1 = __importDefault(require('../../../shared/prisma'))
const monthlyRentPayment_constant_1 = require('./monthlyRentPayment.constant')
const addMonthlyRentPayment = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { user, body } = payload
    const { id: userId } = user
    const { bookingId } = body,
      rest = __rest(body, ['bookingId'])
    const booking = yield prisma_1.default.booking.findUnique({
      where: {
        id: bookingId,
      },
    })
    const propertyId =
      booking === null || booking === void 0 ? void 0 : booking.propertyId
    // Prepare MonthlyRentPayment data with the uploaded image URL
    const updatedData = Object.assign(Object.assign({}, rest), {
      propertyId: propertyId,
      renterId: userId,
    })
    // Create a new MonthlyRentPayment record in the database using Prisma
    const result = yield prisma_1.default.monthlyRentPayment.create({
      data: updatedData,
    })
    // Return the created MonthlyRentPayment data
    return { success: true, data: result }
  })
//Get all MonthlyRentPayments
const getMonthlyRentPayments = (filters, options) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } =
      paginationHelper_1.paginationHelpers.calculatePagination(options)
    const { searchTerm, MonthlyRentPaymentStatus, MonthlyRentPaymentAmount } =
        filters,
      filterData = __rest(filters, [
        'searchTerm',
        'MonthlyRentPaymentStatus',
        'MonthlyRentPaymentAmount',
      ])
    const andConditions = []
    // Handling search term
    if (searchTerm) {
      andConditions.push({
        OR: monthlyRentPayment_constant_1.MonthlyRentPaymentSearchableFields.map(
          field => ({
            [field]: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          }),
        ),
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
          if (
            monthlyRentPayment_constant_1.MonthlyRentPaymentRelationalFields.includes(
              key,
            )
          ) {
            return {
              [monthlyRentPayment_constant_1
                .MonthlyRentPaymentRelationalFieldsMapper[key]]: {
                id: filterData[key],
              },
            }
          } else {
            return {
              [key]: {
                equals: filterData[key],
              },
            }
          }
        }),
      })
    }
    const whereConditions =
      andConditions.length > 0 ? { AND: andConditions } : {}
    const result = yield prisma_1.default.monthlyRentPayment.findMany({
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
    const total = yield prisma_1.default.monthlyRentPayment.count({
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
  })
//Get single MonthlyRentPayment details
const getSingleMonthlyRentPayment = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.monthlyRentPayment.findUnique({
      where: {
        id: payload,
      },
      include: {
        renter: true,
        property: true,
      },
    })
    return result
  })
//Get total MonthlyRentPayment details
const getTotalMonthlyRentPayment = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const totalRent = yield prisma_1.default.monthlyRentPayment.aggregate({
      _sum: {
        amount: true,
      },
    })
    return totalRent._sum.amount || 0
  })
// Get total rent amount for a specific property
const getSpecificPropertyTotalPayment = propertyId =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (!propertyId) {
      throw new Error('Property ID must be provided')
    }
    const totalRent = yield prisma_1.default.monthlyRentPayment.aggregate({
      where: {
        propertyId: propertyId,
      },
      _sum: {
        amount: true,
      },
    })
    return totalRent._sum.amount || 0
  })
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
// const deleteMonthlyRentPayment = async (
//   authUser: string | any,
//   deletedId: any,
// ): Promise<any> => {
//   const isSameUser = await prisma.MonthlyRentPayment.findUnique({
//     where: {
//       id: deletedId,
//     },
//   })
//   // If the MonthlyRentPayment does not exist, throw an error.
//   if (!isSameUser) {
//     throw new ApiError(404, 'MonthlyRentPayment not found')
//   }
//   const { role, id } = authUser
//   if (
//     isSameUser.renterId !== id &&
//     role !== 'admin' &&
//     role !== 'super_admin'
//   ) {
//     throw new ApiError(
//       400,
//       "You haven't permission to delete the MonthlyRentPayment",
//     )
//   }
//   const result = await prisma.MonthlyRentPayment.delete({
//     where: {
//       id: deletedId,
//     },
//   })
//   return result
// }
exports.MonthlyRentPaymentService = {
  addMonthlyRentPayment,
  getMonthlyRentPayments,
  getSingleMonthlyRentPayment,
  getTotalMonthlyRentPayment,
  getSpecificPropertyTotalPayment,
  // updateMonthlyRentPayment,
  // deleteMonthlyRentPayment,
  // getAllRent,
}